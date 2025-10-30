import { CreditOverviewCard } from '@/components/credit/details/CreditOverviewCard';
import { CustomerDetailHeader } from '@/components/credit/details/CustomerDetailHeader';
import { TransactionHistory } from '@/components/credit/transaction/TransactionHistory';
import { useBusiness } from '@/contexts/BusinessContext';
import { database } from '@/db';
import Customer from '@/db/models/customers';
import Sale from '@/db/models/sales';
import { customerService } from '@/db/services/customerService';
import { salesService } from '@/db/services/salesService';
import { Q } from '@nozbe/watermelondb';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomerCreditDetailScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const { selectedBusiness } = useBusiness();
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);

    const getCreditRating = (balance: number): 'Good' | 'Medium' | 'Low' => {
        if (balance > 100) return 'Low';
        if (balance > 50) return 'Medium';
        return 'Good';
    };

    const totalCredits = transactions
        .filter((t) => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalPayments = transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const getDaysLeft = () => {
        const today = new Date();
        const diffTime = dueDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    useEffect(() => {
        let customerSub: any | null = null;
        let salesSub: any | null = null;

        const setupSubscriptions = async () => {
            try {
                setIsLoading(true);

                let customerId = params.customerId as string | undefined;

                if (!customerId) {
                    if (!selectedBusiness) {
                        setCustomer(null);
                        setTransactions([]);
                        setIsLoading(false);
                        return;
                    }

                    const customersWithCredit = await customerService.getCustomersWithCredit(
                        selectedBusiness.id,
                    );

                    if (customersWithCredit.length === 0) {
                        setCustomer(null);
                        setTransactions([]);
                        setIsLoading(false);
                        return;
                    }

                    customerId = customersWithCredit[0].id;
                }

                const customersCollection = database.get<Customer>('customers');
                const salesCollection = database.get<Sale>('sales');

                const customerQuery = customersCollection.query(Q.where('id', customerId));
                const salesQuery = salesCollection.query(
                    Q.where('customer_id', customerId),
                    Q.sortBy('created_at', Q.desc),
                );

                customerSub = customerQuery.observe().subscribe({
                    next: (results: Customer[]) => {
                        const c = results.length > 0 ? results[0] : null;
                        setCustomer(c);
                        setIsLoading(false);
                    },
                    error: (err: any) => {
                        console.error('Error observing customer:', err);
                        setCustomer(null);
                        setIsLoading(false);
                    },
                });

                salesSub = salesQuery.observe().subscribe({
                    next: (salesResults: Sale[]) => {
                        // build transactions including purchases and payments
                        (async () => {
                            try {
                                const txs: any[] = [];

                                for (const sale of salesResults) {
                                    // Purchase entry (credit issued)
                                    txs.push({
                                        id: `sale_${sale.id}`,
                                        saleId: sale.id,
                                        type: 'Purchase',
                                        date: sale.createdAt,
                                        dateLabel: sale.createdAt.toISOString().split('T')[0],
                                        amount:
                                            sale.amountOnCredit === 0
                                                ? sale.totalAmount
                                                : -(sale.amountOnCredit || 0),
                                        isPurchase: true,
                                    });

                                    // Fetch payments for this sale and add as transactions
                                    try {
                                        const payments = await salesService.getPaymentsForSale(
                                            sale.id,
                                        );
                                        const totalPaymentsForSale = payments.length;
                                        for (let i = 0; i < payments.length; i++) {
                                            const p = payments[i];
                                            txs.push({
                                                id: `payment_${p.id}`,
                                                saleId: sale.id,
                                                type: 'Payment',
                                                date: p.createdAt
                                                    ? new Date(p.createdAt)
                                                    : sale.createdAt,
                                                dateLabel: p.createdAt
                                                    ? new Date(p.createdAt)
                                                          .toISOString()
                                                          .split('T')[0]
                                                    : sale.createdAt.toISOString().split('T')[0],
                                                amount: p.amount || 0,
                                                method: p.method || '',
                                                note: p.note || '',
                                                isPurchase: false,

                                                paymentIndex: i + 1,
                                                paymentTotal: totalPaymentsForSale,
                                                paymentDetails: p.details || null,
                                            });
                                        }
                                    } catch (err) {
                                        console.warn(
                                            'Failed to load payments for sale',
                                            sale.id,
                                            err,
                                        );
                                    }
                                }

                                // sort by date descending
                                txs.sort((a, b) => {
                                    const da = a.date ? new Date(a.date).getTime() : 0;
                                    const db = b.date ? new Date(b.date).getTime() : 0;
                                    return db - da;
                                });

                                // format for display: keep dateLabel and amounts
                                const formattedTransactions = txs.map((t) => ({
                                    // For purchases we want the actual sale id so detail screen can load it
                                    id: t.isPurchase ? t.saleId : t.id,
                                    saleId: t.saleId,
                                    type: t.type,
                                    date: t.dateLabel,
                                    amount: t.amount,
                                    isPurchase: t.isPurchase,
                                    // include payment-specific details when type === 'Payment'
                                    ...(t.type === 'Payment'
                                        ? { method: t.method, note: t.note }
                                        : {}),
                                }));

                                setTransactions(formattedTransactions);
                            } catch (err) {
                                console.error('Error building transactions with payments:', err);
                                setTransactions([]);
                            }
                        })();
                    },
                    error: (err: any) => {
                        console.error('Error observing sales for customer:', err);
                        setTransactions([]);
                    },
                });
            } catch (error) {
                console.error('Error setting up subscriptions:', error);
                setCustomer(null);
                setTransactions([]);
                setIsLoading(false);
            }
        };

        setupSubscriptions();

        return () => {
            try {
                customerSub?.unsubscribe?.();
            } catch {}
            try {
                salesSub?.unsubscribe?.();
            } catch {}
        };
    }, [params.customerId, selectedBusiness]);

    const handleBack = () => {
        router.back();
    };

    const handleDelete = async () => {
        if (customer) {
            await customer.markAsDeleted();
            router.back();
        }
    };

    const handleTransactionPress = (transaction: any) => {
        // If this is a payment transaction, show payment details modal
        if (transaction.type === 'Payment') {
            setSelectedPayment(transaction);
            setIsPaymentModalVisible(true);
            return;
        }

        router.push({
            pathname: '/credit/transaction-detail',
            params: {
                transactionId: transaction.id,
            },
        });
    };

    if (isLoading) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50'>
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size='large' color='#000' />
                    <Text className='mt-4 text-gray-500'>Loading customer details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!customer) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50'>
                <View className='flex-1 items-center justify-center'>
                    <Text className='text-gray-500'>Customer not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <CustomerDetailHeader
                customerName={customer.name}
                phoneNumber={customer.phone || 'No phone'}
                rating={getCreditRating(customer.currentBalance)}
                onBack={handleBack}
                onDelete={handleDelete}
            />

            <ScrollView className='flex-1'>
                <CreditOverviewCard
                    currentBalance={customer.currentBalance}
                    totalCredits={totalCredits}
                    totalPayments={totalPayments}
                    dueDate={dueDate.toISOString().split('T')[0]}
                    daysLeft={getDaysLeft()}
                />

                <TransactionHistory
                    transactions={transactions}
                    onTransactionPress={handleTransactionPress}
                />
            </ScrollView>

            {/* Payment details modal */}
            {isPaymentModalVisible && selectedPayment && (
                <View className='absolute inset-0 bg-black/40 items-center justify-center'>
                    <View className='w-11/12 bg-white rounded-xl p-4'>
                        <Text className='text-lg font-semibold mb-2'>Payment Details</Text>
                        <Text className='text-sm text-gray-600'>
                            Method: {selectedPayment.method}
                        </Text>
                        {selectedPayment.note ? (
                            <Text className='text-sm text-gray-600 mt-1'>
                                Note: {selectedPayment.note}
                            </Text>
                        ) : null}
                        <Text className='text-sm text-gray-600 mt-2'>
                            Amount: ${selectedPayment.amount.toFixed(2)}
                        </Text>
                        {selectedPayment.date ? (
                            <Text className='text-sm text-gray-400 mt-1'>
                                {selectedPayment.date}
                            </Text>
                        ) : null}

                        <View className='flex-row mt-4'>
                            <Text
                                className='flex-1 text-center text-blue-500 font-semibold'
                                onPress={() => setIsPaymentModalVisible(false)}>
                                Close
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default CustomerCreditDetailScreen;
