import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { useCart } from '@/contexts/CartContext';
import Customer from '@/db/models/customers';
import { customerService } from '@/db/services/customerService';
import { salesService } from '@/db/services/salesService';
import type { CartItem } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export interface CheckoutState {
    selectedPaymentMethod: 'mpesa' | 'store-credit' | 'cash' | null;
    mpesaAmount: string;
    mpesaPhone: string;
    cashAmount: string;
    creditAmount: string;
    creditRemainingMethod: 'mpesa' | 'cash';
    dueDate?: string | null;
    customerSearchQuery: string;
    selectedCustomer: Customer | null;
    searchResults: Customer[];
    isSearching: boolean;
    isProcessing: boolean;
    hasManuallyEditedMpesa: boolean;
    hasManuallyEditedCash: boolean;
    hasManuallyEditedCredit: boolean;
}

export const useCheckout = (cartItems: CartItem[], total: number) => {
    const { user } = useAuth();
    const { selectedStore, selectedBusiness } = useBusiness();
    const { clearCart, wholesaleMode } = useCart();

    const [state, setState] = useState<CheckoutState>({
        selectedPaymentMethod: null,
        mpesaAmount: '',
        mpesaPhone: '',
        cashAmount: '',
        creditAmount: '',
        creditRemainingMethod: 'cash',
        dueDate: null,
        customerSearchQuery: '',
        selectedCustomer: null,
        searchResults: [],
        isSearching: false,
        isProcessing: false,
        hasManuallyEditedMpesa: false,
        hasManuallyEditedCash: false,
        hasManuallyEditedCredit: false,
    });

    // maintain a local set of excluded customer ids
    const [excludedCustomerIds, setExcludedCustomerIds] = useState<string[]>([]);

    const excludeCustomer = useCallback((customerId: string) => {
        setExcludedCustomerIds((prev) =>
            prev.includes(customerId) ? prev : [...prev, customerId],
        );
    }, []);

    const roundToTwoDecimals = (num: number) => Math.round(num * 100) / 100;

    // Compute total discount from cart items and derive adjusted total used for payment validation
    const totalDiscount = cartItems.reduce((sum, item) => sum + (item.discount || 0), 0);
    const adjustedTotal = Math.max(0, total - totalDiscount);

    const mpesaValue = roundToTwoDecimals(parseFloat(state.mpesaAmount) || 0);
    const cashValue = roundToTwoDecimals(parseFloat(state.cashAmount) || 0);
    const creditValue = roundToTwoDecimals(parseFloat(state.creditAmount) || 0);
    const roundedTotal = roundToTwoDecimals(adjustedTotal);

    const totalPaid = roundToTwoDecimals(mpesaValue + cashValue + creditValue);
    const remainingAmount = roundToTwoDecimals(roundedTotal - totalPaid);

    const isPartialCash =
        state.selectedPaymentMethod === 'cash' && cashValue > 0 && remainingAmount > 0;

    const isPartialMpesa =
        state.selectedPaymentMethod === 'mpesa' && mpesaValue > 0 && remainingAmount > 0;

    const isPartialCredit =
        state.selectedPaymentMethod === 'store-credit' && creditValue > 0 && remainingAmount > 0;

    const requiresCustomer = state.selectedPaymentMethod === 'store-credit' && creditValue > 0;

    useEffect(() => {
        const searchCustomers = async () => {
            if (!state.customerSearchQuery.trim() || !selectedBusiness) {
                setState((prev) => ({ ...prev, searchResults: [] }));
                return;
            }

            setState((prev) => ({ ...prev, isSearching: true }));

            try {
                // If a store is selected, prefer store-scoped customers, otherwise search by business
                let results = await customerService.searchCustomers(
                    selectedBusiness.id,
                    state.customerSearchQuery,
                    selectedStore?.id,
                );

                // filter out any locally-excluded customer ids
                if (excludedCustomerIds && excludedCustomerIds.length > 0) {
                    results = results.filter((r) => !excludedCustomerIds.includes((r as any).id));
                }

                setState((prev) => ({ ...prev, searchResults: results, isSearching: false }));
            } catch (error) {
                console.error('Error searching customers:', error);
                setState((prev) => ({ ...prev, searchResults: [], isSearching: false }));
            }
        };

        const timeoutId = setTimeout(searchCustomers, 300);
        return () => clearTimeout(timeoutId);
    }, [state.customerSearchQuery, selectedBusiness, excludedCustomerIds, selectedStore?.id]);

    const selectPaymentMethod = useCallback(
        (method: 'mpesa' | 'store-credit' | 'cash') => {
            setState((prev) => {
                const hasAnyAmount =
                    parseFloat(prev.mpesaAmount || '0') > 0 ||
                    parseFloat(prev.cashAmount || '0') > 0 ||
                    parseFloat(prev.creditAmount || '0') > 0;

                const totalPaidSoFar = roundToTwoDecimals(
                    parseFloat(prev.mpesaAmount || '0') +
                        parseFloat(prev.cashAmount || '0') +
                        parseFloat(prev.creditAmount || '0'),
                );
                const remaining = roundToTwoDecimals(roundedTotal - totalPaidSoFar);

                const amountToFill = hasAnyAmount
                    ? Math.max(0, remaining).toFixed(2)
                    : roundedTotal.toFixed(2);

                const shouldFillMpesa =
                    method === 'mpesa' && !prev.hasManuallyEditedMpesa && prev.mpesaAmount === '';
                const shouldFillCash =
                    method === 'cash' && !prev.hasManuallyEditedCash && prev.cashAmount === '';
                const shouldFillCredit =
                    method === 'store-credit' &&
                    !prev.hasManuallyEditedCredit &&
                    prev.creditAmount === '';

                return {
                    ...prev,
                    selectedPaymentMethod: method,
                    mpesaAmount: shouldFillMpesa ? amountToFill : prev.mpesaAmount,
                    cashAmount: shouldFillCash ? amountToFill : prev.cashAmount,
                    creditAmount: shouldFillCredit ? amountToFill : prev.creditAmount,
                };
            });
        },
        [roundedTotal],
    );

    const switchToPartialPayment = useCallback(
        (fromMethod: 'mpesa' | 'cash', toMethod: 'mpesa' | 'cash' | 'store-credit') => {
            setState((prev) => {
                const totalPaidSoFar = roundToTwoDecimals(
                    parseFloat(prev.mpesaAmount || '0') +
                        parseFloat(prev.cashAmount || '0') +
                        parseFloat(prev.creditAmount || '0'),
                );
                const remaining = Math.max(0, roundToTwoDecimals(roundedTotal - totalPaidSoFar));

                const shouldFillMpesa =
                    toMethod === 'mpesa' && !prev.hasManuallyEditedMpesa && prev.mpesaAmount === '';
                const shouldFillCash =
                    toMethod === 'cash' && !prev.hasManuallyEditedCash && prev.cashAmount === '';
                const shouldFillCredit =
                    toMethod === 'store-credit' &&
                    !prev.hasManuallyEditedCredit &&
                    prev.creditAmount === '';

                return {
                    ...prev,
                    selectedPaymentMethod: toMethod,
                    mpesaAmount: shouldFillMpesa ? remaining.toFixed(2) : prev.mpesaAmount,
                    cashAmount: shouldFillCash ? remaining.toFixed(2) : prev.cashAmount,
                    creditAmount: shouldFillCredit ? remaining.toFixed(2) : prev.creditAmount,
                };
            });
        },
        [roundedTotal],
    );

    const setMpesaAmount = useCallback((amount: string) => {
        setState((prev) => ({ ...prev, mpesaAmount: amount, hasManuallyEditedMpesa: true }));
    }, []);

    const setCashAmount = useCallback((amount: string) => {
        setState((prev) => ({ ...prev, cashAmount: amount, hasManuallyEditedCash: true }));
    }, []);

    const setCreditAmount = useCallback((amount: string) => {
        setState((prev) => ({ ...prev, creditAmount: amount, hasManuallyEditedCredit: true }));
    }, []);

    const setMpesaPhone = useCallback((phone: string) => {
        setState((prev) => ({ ...prev, mpesaPhone: phone }));
    }, []);

    const setCreditRemainingMethod = useCallback((method: 'mpesa' | 'cash') => {
        setState((prev) => ({ ...prev, creditRemainingMethod: method }));
    }, []);

    const setDueDate = useCallback((d: string | null) => {
        setState((prev) => ({ ...prev, dueDate: d }));
    }, []);

    const setCustomerSearchQuery = useCallback((query: string) => {
        setState((prev) => ({ ...prev, customerSearchQuery: query }));
    }, []);

    const selectCustomer = useCallback((customer: Customer | null) => {
        setState((prev) => ({
            ...prev,
            selectedCustomer: customer,
            customerSearchQuery: customer ? customer.name : '',
            searchResults: [],
        }));
    }, []);

    const createAndSelectCustomer = useCallback(
        async (customerData: { name?: string; phone?: string; email?: string }) => {
            if (!selectedBusiness) return;

            try {
                const { customer } = await customerService.findOrCreateCustomer({
                    businessId: selectedBusiness.id,
                    storeId: selectedStore?.id,
                    ...customerData,
                });

                selectCustomer(customer);
            } catch (error) {
                console.error('Error creating customer:', error);
            }
        },
        [selectedBusiness, selectedStore, selectCustomer],
    );

    const getPaymentError = useCallback((): string | null => {
        if (!user || !selectedStore) return 'Setup Required';
        if (cartItems.length === 0) return 'Cart is Empty';
        if (roundedTotal <= 0) return 'Invalid Total';

        const totalPaidCalc = mpesaValue + cashValue + creditValue;
        const difference = roundedTotal - totalPaidCalc;

        if (Math.abs(difference) > 0.001) {
            if (difference > 0) {
                return `Remaining $${difference.toFixed(2)}`;
            } else {
                return `Reduce by $${Math.abs(difference).toFixed(2)}`;
            }
        }

        if (mpesaValue > 0 && !state.mpesaPhone.trim()) {
            return 'Enter M-Pesa Phone';
        }

        if (creditValue > 0 && !state.selectedCustomer) {
            return 'Select Customer';
        }

        return null;
    }, [
        selectedStore,
        user,
        cartItems,
        state.mpesaPhone,
        state.selectedCustomer,
        mpesaValue,
        cashValue,
        creditValue,
        roundedTotal,
    ]);

    const canProcessPayment = useCallback((): boolean => {
        return getPaymentError() === null;
    }, [getPaymentError]);

    const processPayment = useCallback(async (): Promise<{ success: boolean; saleId?: string }> => {
        const validationError = getPaymentError();
        if (validationError) {
            console.error('Payment validation failed:', validationError);
            return { success: false };
        }

        if (!user || !selectedStore) {
            console.error('User or store not selected');
            return { success: false };
        }

        if (cartItems.length === 0) {
            console.error('Cart is empty');
            return { success: false };
        }

        if (roundedTotal <= 0) {
            console.error('Invalid total amount');
            return { success: false };
        }

        const totalPaidCalc = mpesaValue + cashValue + creditValue;
        if (Math.abs(totalPaidCalc - roundedTotal) > 0.001) {
            console.error('Payment amounts do not match total');
            return { success: false };
        }

        if (mpesaValue > 0 && !state.mpesaPhone.trim()) {
            console.error('M-Pesa phone number required');
            return { success: false };
        }

        if (creditValue > 0 && !state.selectedCustomer) {
            console.error('Customer required for credit payments');
            return { success: false };
        }

        setState((prev) => ({ ...prev, isProcessing: true }));

        try {
            let amountPaid = 0;
            let amountOnCredit = 0;
            let paymentMethod: string = state.selectedPaymentMethod || 'cash';
            const paymentMethodsUsed: string[] = [];
            let onCredit = amountOnCredit > 0;

            if (mpesaValue > 0) paymentMethodsUsed.push('mpesa');
            if (cashValue > 0) paymentMethodsUsed.push('cash');
            if (creditValue > 0) paymentMethodsUsed.push('store-credit');

            if (mpesaValue > 0 && cashValue > 0) {
                amountPaid = mpesaValue + cashValue;
                // If creditValue is also present (three-way split), keep it as amountOnCredit
                if (creditValue > 0) {
                    amountOnCredit = creditValue;
                }
                paymentMethod = 'split';
            } else if (mpesaValue > 0 && creditValue > 0) {
                amountPaid = mpesaValue;
                amountOnCredit = creditValue;
                paymentMethod = 'mpesa';
            } else if (cashValue > 0 && creditValue > 0) {
                amountPaid = cashValue;
                amountOnCredit = creditValue;
                paymentMethod = 'cash';
            } else if (state.selectedPaymentMethod === 'mpesa') {
                amountPaid = mpesaValue;
                paymentMethod = 'mpesa';
            } else if (state.selectedPaymentMethod === 'cash') {
                amountPaid = cashValue;
                paymentMethod = 'cash';
            } else if (state.selectedPaymentMethod === 'store-credit') {
                onCredit = true;
                amountOnCredit = creditValue;
                if (isPartialCredit) {
                    amountPaid = remainingAmount;
                    paymentMethod = state.creditRemainingMethod;
                } else {
                    paymentMethod = 'store-credit';
                }
            }

            console.log('Processing payment amount', amountOnCredit, 'on credit');

            const totalDiscount = cartItems.reduce((sum, item) => sum + (item.discount || 0), 0);
            const adjustedTotal = total - totalDiscount;
            onCredit = amountOnCredit > 0;

            const saleData = {
                storeId: selectedStore.id,
                userId: user.id,
                customerId: state.selectedCustomer?.id,
                subtotal: total,
                discountAmount: totalDiscount,
                discountPercentage: Math.round((totalDiscount / total) * 100),
                totalAmount: adjustedTotal,
                paymentMethod,
                paymentMethodsUsed: JSON.stringify(paymentMethodsUsed),
                mpesaAmount: mpesaValue,
                cashAmount: cashValue,
                onCredit,
                amountPaid,
                amountOnCredit: creditValue,
                dueDate: state.dueDate ? new Date(state.dueDate).getTime() : undefined,
                isWholesale: !!wholesaleMode,
            };

            const items = cartItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                discount: item.discount || 0,
                totalPrice: item.price * item.quantity - (item.discount || 0),
            }));

            const sale = await salesService.createSale(saleData, items);

            // Only mark as complete if there's no outstanding credit (fully paid)

            await salesService.completeSale(sale.id);

            const createdSaleId = sale.id;

            clearCart();

            setState({
                selectedPaymentMethod: null,
                mpesaAmount: '',
                mpesaPhone: '',
                cashAmount: '',
                creditAmount: '',
                creditRemainingMethod: 'cash',
                customerSearchQuery: '',
                selectedCustomer: null,
                searchResults: [],
                isSearching: false,
                isProcessing: false,
                hasManuallyEditedMpesa: false,
                hasManuallyEditedCash: false,
                hasManuallyEditedCredit: false,
            });
            return { success: true, saleId: createdSaleId };
        } catch (error) {
            console.error('Error processing payment:', error);
            setState((prev) => ({ ...prev, isProcessing: false }));
            return { success: false };
        }
    }, [
        getPaymentError,
        user,
        selectedStore,
        cartItems,
        roundedTotal,
        mpesaValue,
        cashValue,
        creditValue,
        state.mpesaPhone,
        state.selectedCustomer,
        state.selectedPaymentMethod,
        state.creditRemainingMethod,
        state.dueDate,
        total,
        clearCart,
        isPartialCredit,
        remainingAmount,
        wholesaleMode,
    ]);

    return {
        ...state,
        requiresCustomer,
        isPartialCredit,
        isPartialCash,
        isPartialMpesa,
        remainingAmount,
        totalPaid,
        mpesaValue,
        cashValue,
        creditValue,
        selectPaymentMethod,
        switchToPartialPayment,
        setMpesaAmount,
        setCashAmount,
        setCreditAmount,
        setMpesaPhone,
        setCreditRemainingMethod,
        setCustomerSearchQuery,
        selectCustomer,
        createAndSelectCustomer,
        processPayment,
        setDueDate,
        canProcessPayment,
        getPaymentError,
        total,
        roundedTotal,
        excludedCustomerIds,
        excludeCustomer,
    };
};
