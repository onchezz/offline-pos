import { useBusiness } from '@/contexts/BusinessContext';
import Customer from '@/db/models/customers';
import { customerService } from '@/db/services/customerService';
import { salesService } from '@/db/services/salesService';
import { useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';

export const useCreditData = () => {
    const { selectedBusiness, selectedStore } = useBusiness();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [latestSaleByCustomer, setLatestSaleByCustomer] = useState<any | null>(null);
    const [totalCreditAmount, setTotalCreditAmount] = useState<number>(0);

    const getDaysDue = (dueTimestamp?: number | null) => {
        if (!dueTimestamp) return null;
        const today = new Date();
        const due = new Date(dueTimestamp);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff; // positive = days left, negative = days overdue
    };

    useEffect(() => {
        // Use a live query subscription so the UI updates when customer balances change
        if (!selectedBusiness) {
            setCustomers([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Observe customers with credit scoped to store when available, otherwise business-wide
        const observable = customerService.observeCustomersWithCredit(
            selectedBusiness.id,
            selectedStore?.id,
        );

        const subscription = observable.subscribe({
            next: (results: Customer[]) => {
                const withCredit = results.filter((c) => (c.currentBalance || 0) > 0);
                setCustomers(withCredit);
                setIsLoading(false);
            },
            error: (err: any) => {
                console.error('Error observing customers with credit:', err);
                setCustomers([]);
                setIsLoading(false);
                // Show user-facing toast for observable errors
                try {
                    Toast.show({
                        type: 'error',
                        text1: 'Error loading credits',
                        text2: err?.message || 'Failed to load customer credits.',
                        position: 'bottom',
                    });
                } catch (e) {
                    // swallow toast errors to avoid breaking the app
                    console.warn('Toast error:', e);
                }
            },
        });

        // Also subscribe to the reactive total credit observable so callers can
        // display the total without re-reducing the customer list themselves.
        const totalSub = customerService
            .observeTotalCredit(selectedBusiness.id, selectedStore?.id)
            .subscribe({
                next: (sum: number) => {
                    // debug log to help verify reactive emissions during development
                    // remove or lower log level in production
                    // console.debug('observeTotalCredit emitted:', sum);
                    setTotalCreditAmount(sum);
                },
                error: (err: any) => console.warn('Error observing total credit:', err),
            });

        return () => {
            try {
                subscription.unsubscribe();
            } catch {}
            try {
                totalSub.unsubscribe();
            } catch {}
        };
    }, [selectedBusiness, selectedStore?.id]);

    const filteredCustomers = useMemo(() => {
        if (!searchQuery.trim()) return customers;

        const query = searchQuery.toLowerCase();
        return customers.filter((customer) => {
            const name = (customer?.name || '').toLowerCase();
            const phone = (customer?.phone || '').toLowerCase();
            const email = (customer?.email || '').toLowerCase();

            return name.includes(query) || phone.includes(query) || email.includes(query);
        });
    }, [customers, searchQuery]);

    // totalCreditAmount is driven by the DB observable `observeTotalCredit`
    // and kept in local state `totalCreditAmount` which updates reactively.

    const handleRecordPayment = async (
        customerParam?: Customer | null,
        amountParam?: string,
        methodParam?: string,
        detailsParam?: any,
    ) => {
        // Allow callers to pass customer and amount directly to avoid relying on
        // async state updates that may not have flushed yet.
        const customerToUse = customerParam ?? selectedCustomer;
        const amountToUse = amountParam ?? paymentAmount;

        if (!customerToUse || !amountToUse) {
            console.warn('Customer and payment amount required');
            try {
                Toast.show({
                    type: 'error',
                    text1: 'Missing information',
                    text2: 'Customer and payment amount are required.',
                    position: 'bottom',
                });
            } catch (e) {
                console.warn('Toast error:', e);
            }
            return;
        }

        try {
            const amount = parseFloat(amountToUse);
            const balance = customerToUse.currentBalance || 0;
            if (isNaN(amount) || amount <= 0 || amount > balance) {
                console.warn('Invalid payment amount or amount exceeds balance');
                try {
                    Toast.show({
                        type: 'error',
                        text1: 'Invalid amount',
                        text2: isNaN(amount)
                            ? 'Payment amount is not a valid number.'
                            : amount <= 0
                              ? 'Payment amount must be greater than zero.'
                              : 'Payment amount exceeds customer balance.',
                        position: 'bottom',
                    });
                } catch (e) {
                    console.warn('Toast error:', e);
                }
                return;
            }

            // Distribute payment starting from the oldest outstanding sale
            let remainingAmount = amount;
            const allSales = await salesService.getSalesByCustomer(customerToUse.id);

            // Sort oldest first by created timestamp (defensive: try multiple field names)
            allSales.sort((a: any, b: any) => {
                const aTime = a.createdAt || a.created_at || 0;
                const bTime = b.createdAt || b.created_at || 0;
                return aTime - bTime;
            });

            const outstandingSales = allSales.filter((s: any) => {
                const remaining = (s.totalAmount || 0) - (s.amountPaid || 0);
                return remaining > 0;
            });

            for (const s of outstandingSales) {
                if (remainingAmount <= 0) break;
                const remainingOnSale = (s.totalAmount || 0) - (s.amountPaid || 0);
                if (remainingOnSale <= 0) continue;

                const payThis = Math.min(remainingOnSale, remainingAmount);

                // Create a payment for this sale. salesService.createPayment will
                // update the sale and the customer's balance inside a DB writer.
                await salesService.createPayment({
                    saleId: s.id,
                    amount: payThis,
                    method: methodParam || 'store-credit',
                    paymentDate: Date.now(),
                    details: detailsParam,
                });

                remainingAmount -= payThis;
            }

            // If there's remaining amount after paying outstanding sales, apply it
            // directly to the customer's balance (fallback).
            if (remainingAmount > 0) {
                await customerService.recordPayment(customerToUse.id, remainingAmount);
            }
        } catch (e: any) {
            try {
                Toast.show({
                    type: 'error',
                    text1: 'Payment failed',
                    text2: e ?? 'An error occurred while recording the payment.',
                    position: 'top',
                });
            } catch (e) {
                console.warn('Toast error:', e);
            }
        }
    };

    const fetchLatestSaleForCustomer = async (customerId: string) => {
        const sales = await salesService.getSalesByCustomer(customerId);
        // find the most recent outstanding sale
        for (const s of sales) {
            const remaining = (s.totalAmount || 0) - (s.amountPaid || 0);
            if (remaining > 0) {
                setLatestSaleByCustomer(s);
                return s;
            }
        }
        setLatestSaleByCustomer(null);
        return null;
    };

    return {
        customers: filteredCustomers,
        allCustomers: customers,
        isLoading,
        searchQuery,
        setSearchQuery,
        totalCreditAmount,
        selectedCustomer,
        setSelectedCustomer,
        paymentAmount,
        setPaymentAmount,
        handleRecordPayment,
        latestSale: latestSaleByCustomer,
        fetchLatestSaleForCustomer,
        getDaysDue,
    };
};
