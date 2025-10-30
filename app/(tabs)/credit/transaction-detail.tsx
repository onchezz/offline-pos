import { Header } from '@/components/common/Header';
import { useBusiness } from '@/contexts/BusinessContext';
import Customer from '@/db/models/customers';
import Product from '@/db/models/products';
import Sale from '@/db/models/sales';
import SaleItem from '@/db/models/sales_items';
import Store from '@/db/models/stores';
import User from '@/db/models/users';
import { salesService } from '@/db/services/salesService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionDetailScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const transactionId = params.transactionId as string;
    const { selectedStore } = useBusiness();

    const [sale, setSale] = useState<Sale | null>(null);
    const [items, setItems] = useState<{ item: SaleItem; product: Product }[]>([]);
    const [cashier, setCashier] = useState<User | null>(null);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [store, setStore] = useState<Store | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [payments, setPayments] = useState<any[]>([]);

    const safeParsePaymentMethods = (paymentMethodsStr?: string): string[] | null => {
        if (!paymentMethodsStr) return null;
        try {
            const parsed = JSON.parse(paymentMethodsStr);
            return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            if (!transactionId) return;
            setIsLoading(true);
            try {
                const saleData = await salesService.getSaleWithItems(transactionId);
                setSale(saleData.sale);
                setItems(saleData.items);
                const storeData = await saleData.sale.store.fetch();
                setStore(storeData);
                const cashierData = await saleData.sale.user.fetch();
                setCashier(cashierData);
                if (saleData.sale.customerId) {
                    const customerData = await saleData.sale.customer?.fetch();
                    setCustomer(customerData || null);
                }
                // fetch payments for this sale
                try {
                    const ps = await salesService.getPaymentsForSale(transactionId);
                    setPayments(ps || []);
                } catch (err) {
                    console.warn('Failed to load payments for sale', transactionId, err);
                }
            } catch (err) {
                console.error('Error fetching transaction details:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactionDetails();
    }, [transactionId]);

    const renderPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'mpesa':
                return 'wallet-outline';
            case 'cash':
                return 'cash-outline';
            case 'store-credit':
                return 'card-outline';
            default:
                return 'card-outline';
        }
    };

    const getPaymentAmount = (method: string) => {
        switch (method) {
            case 'mpesa':
                return sale?.mpesaAmount ?? 0;
            case 'cash':
                return sale?.cashAmount ?? 0;
            case 'store-credit':
                return sale?.amountOnCredit ?? 0;
            default:
                return 0;
        }
    };
    const printSale = () => {
        if (transactionId) router.push(`/checkout/receipt/${transactionId}`);
    };

    if (isLoading) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50'>
                <View className='flex-1 items-center justify-center'>
                    <ActivityIndicator size='large' color='#007AFF' />
                    <Text className='mt-3 text-gray-600 text-sm'>Loading transaction...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!sale) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50 items-center justify-center'>
                <Ionicons name='alert-circle-outline' size={64} color='#FF3B30' />
                <Text className='text-lg font-semibold text-gray-800 mt-2'>
                    Transaction not found
                </Text>
                <Text className='text-sm text-gray-500 mt-1'>
                    Please check the ID and try again.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <Header title='Transaction Details' showBackButton />

            <ScrollView className='flex-1 px-4 pt-2 pb-8'>
                {/* Transaction Header */}
                <View className='bg-white rounded-2xl shadow-sm p-5 mb-4'>
                    <View className='flex-row justify-between items-center mb-2'>
                        <Text className='text-xs text-gray-500'>Transaction</Text>
                        <View className='flex-row items-center'>
                            <Text
                                className={`text-xs font-semibold mr-2 ${
                                    sale.status === 'completed'
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                }`}>
                                {sale.status?.toUpperCase()}
                            </Text>
                            <View
                                className={`w-2 h-2 rounded-full ${
                                    sale.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                            />
                        </View>
                    </View>

                    <Text className='text-lg font-bold text-gray-900 mb-3'>{sale.externalId}</Text>

                    <View className='flex-row justify-between'>
                        <View className='flex-row items-center'>
                            <Ionicons name='calendar-outline' size={16} color='#8E8E93' />
                            <Text className='ml-2 text-sm text-gray-600'>
                                {new Date(sale.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                        <View className='flex-row items-center'>
                            <Ionicons name='time-outline' size={16} color='#8E8E93' />
                            <Text className='ml-2 text-sm text-gray-600'>
                                {new Date(sale.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Payment Method */}
                <View className='bg-white rounded-2xl shadow-sm p-5 mb-4'>
                    <Text className='text-sm font-medium text-gray-600 mb-3'>Payment Methods</Text>
                    {(safeParsePaymentMethods(sale.paymentMethodsUsed) || [sale.paymentMethod]).map(
                        (method, i) => {
                            const amount = getPaymentAmount(method);
                            return (
                                <View
                                    key={i}
                                    className='flex-row justify-between items-center py-2'>
                                    <View className='flex-row items-center'>
                                        {/* <View className='w-9 h-9 rounded-full bg-blue-100 items-center justify-center mr-3'> */}
                                        <Ionicons
                                            name={renderPaymentMethodIcon(method)}
                                            size={18}
                                            color={
                                                renderPaymentMethodIcon(method) === 'wallet-outline'
                                                    ? '#34C759'
                                                    : renderPaymentMethodIcon(method) ===
                                                        'cash-outline'
                                                      ? '#007AFF'
                                                      : '#FF9500'
                                            }
                                        />
                                        {/* </View> */}
                                        <Text className='text-base font-semibold text-gray-900 capitalize'>
                                            {method.replace('-', ' ')}
                                        </Text>
                                    </View>
                                    {amount > 0 && (
                                        <Text className='text-base font-bold text-gray-900'>
                                            {selectedStore!.currency || 'Kes'} {amount.toFixed(2)}
                                        </Text>
                                    )}
                                </View>
                            );
                        },
                    )}
                </View>
                {/* Store & Cashier */}
                <View className='bg-white rounded-2xl shadow-sm p-5 mb-4'>
                    <View className='flex-row justify-between'>
                        <View className='flex-1'>
                            <Text className='text-xs text-gray-500 mb-1'>Store</Text>
                            <Text className='text-base font-semibold text-gray-900'>
                                {store?.name || 'N/A'}
                            </Text>
                        </View>
                        <View className='flex-1 items-end'>
                            <Text className='text-xs text-gray-500 mb-1'>Cashier</Text>
                            <Text className='text-base font-semibold text-gray-900'>
                                {cashier?.name || 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Customer */}
                {customer && (
                    <View className='bg-white rounded-2xl shadow-sm p-5 mb-4'>
                        <View className='flex-row items-center mb-3'>
                            <Ionicons name='person-outline' size={18} color='#007AFF' />
                            <Text className='ml-2 text-sm font-medium text-gray-700'>Customer</Text>
                        </View>
                        {customer ? (
                            <>
                                <Text className='text-base font-semibold text-gray-900'>
                                    {customer.name}
                                </Text>
                                <Text className='text-sm text-gray-600 mt-1'>{customer.phone}</Text>
                            </>
                        ) : (
                            <Text className='text-sm text-gray-400'>Not provided</Text>
                        )}
                    </View>
                )}

                {/* Items */}
                <View className='bg-white rounded-2xl shadow-sm p-5 mb-4'>
                    <View className='flex-row items-center mb-3'>
                        <Ionicons name='cube-outline' size={18} color='#007AFF' />
                        <Text className='ml-2 text-sm font-medium text-gray-700'>Items</Text>
                    </View>
                    {items.length === 0 ? (
                        <Text className='text-sm text-gray-400 text-center py-4'>No items</Text>
                    ) : (
                        items.map(({ item, product }, i) => (
                            <View
                                key={item.id}
                                className={`flex-row justify-between py-2 ${
                                    i < items.length - 1 ? 'border-b border-gray-100' : ''
                                }`}>
                                <View className='flex-1'>
                                    <Text className='text-xs text-gray-500'>{product.barcode}</Text>
                                    <Text className='text-base font-semibold text-gray-900'>
                                        {product.name}
                                    </Text>
                                </View>
                                <View className='items-end'>
                                    <Text className='text-sm text-gray-600'>
                                        {selectedStore!.currency} {item.unitPrice.toFixed(2)} ×{' '}
                                        {item.quantity}
                                    </Text>
                                    <Text className='text-lg font-bold text-gray-900'>
                                        {selectedStore!.currency}
                                        {item.totalPrice.toFixed(2)}
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
                {/* Amount Breakdown */}
                <View className='bg-white rounded-2xl shadow-sm p-5'>
                    <Text className='text-sm font-medium text-gray-700 mb-3'>Amount Breakdown</Text>
                    <View className='space-y-2 mb-2'>
                        <View className='flex-row justify-between'>
                            <Text className='text-gray-600'>Subtotal</Text>
                            <Text className='font-semibold text-gray-900'>
                                {selectedStore!.currency}
                                {sale.subtotal?.toFixed(2) ?? '0.00'}
                            </Text>
                        </View>
                        {sale.discountAmount > 0 && (
                            <View className='flex-row justify-between'>
                                <Text className='text-gray-600'>
                                    Discount ({sale.discountPercentage}%)
                                </Text>
                                <Text className='font-semibold text-red-500'>
                                    - {selectedStore!.currency}
                                    {sale.discountAmount.toFixed(2)}
                                </Text>
                            </View>
                        )}
                    </View>
                    <View className='flex-row justify-between border-t border-gray-200 pt-3 mt-2'>
                        <Text className='text-base font-bold text-gray-900'>Total</Text>
                        <Text className='text-xl font-bold text-gray-900'>
                            {selectedStore!.currency}
                            {sale.totalAmount?.toFixed(2) ?? '0.00'}
                        </Text>
                    </View>
                    <View className='flex-row justify-between mt-2'>
                        <Text className='text-gray-600'>Paid</Text>
                        <Text className='font-semibold text-green-600'>
                            {selectedStore!.currency}
                            {sale.amountPaid?.toFixed(2) ?? '0.00'}
                        </Text>
                    </View>
                    {sale.amountOnCredit > 0 && (
                        <View className='flex-row justify-between mt-2'>
                            <Text className='text-gray-600'>Credit</Text>
                            <Text className='font-semibold text-orange-600'>
                                {selectedStore!.currency}
                                {sale.amountOnCredit.toFixed(2)}
                            </Text>
                        </View>
                    )}
                    {/* Payments list */}
                    <View className='mt-4'>
                        <Text className='text-sm font-medium text-gray-700 mb-3'>Payments</Text>
                        {payments.length === 0 ? (
                            <Text className='text-sm text-gray-400'>No payments recorded</Text>
                        ) : (
                            payments.map((p, idx) => {
                                const total = payments.length;
                                // parse details field if present
                                let parsedDetails: any = null;
                                if (p.details) {
                                    try {
                                        parsedDetails =
                                            typeof p.details === 'string'
                                                ? JSON.parse(p.details)
                                                : p.details;
                                    } catch {
                                        parsedDetails = p.details;
                                    }
                                }

                                return (
                                    <View
                                        key={p.id}
                                        className='flex-row justify-between items-center py-2'>
                                        <View>
                                            <Text className='text-base font-semibold text-gray-900'>
                                                {p.method ? p.method.replace('-', ' ') : 'Payment'}
                                            </Text>
                                            <Text className='text-sm text-gray-500'>
                                                {p.note || ''}
                                                {parsedDetails && parsedDetails.value
                                                    ? ` • ${parsedDetails.value}`
                                                    : ''}
                                            </Text>
                                            <Text className='text-xs text-gray-400 mt-1'>
                                                Payment {idx + 1} of {total}
                                            </Text>
                                        </View>
                                        <View className='items-end'>
                                            <Text className='font-semibold text-gray-900'>
                                                {selectedStore!.currency}
                                                {p.amount.toFixed(2)}
                                            </Text>
                                            {(() => {
                                                const pd = p.paymentDate ?? p.createdAt;
                                                if (!pd) return null;
                                                const pdDate =
                                                    pd instanceof Date ? pd : new Date(pd);
                                                return (
                                                    <Text className='text-xs text-gray-400'>
                                                        {pdDate.toLocaleString()}
                                                    </Text>
                                                );
                                            })()}
                                        </View>
                                    </View>
                                );
                            })
                        )}
                    </View>
                    <View className='flex-row  px-4 py-2'>
                        <TouchableOpacity
                            className='flex-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl mr-2 py-3 items-center flex-row justify-center'
                            onPress={printSale}>
                            <Ionicons name='print' size={18} color='#333' />
                            <Text className='ml-2 font-semibold text-gray-800'>Print</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='flex-1 bg-blue-500 rounded-xl ml-2 py-3 items-center flex-row justify-center'>
                            <Ionicons name='download-outline' size={18} color='#fff' />
                            <Text className='ml-2 font-semibold text-white'>Download</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Buttons */}
        </SafeAreaView>
    );
};

export default TransactionDetailScreen;
