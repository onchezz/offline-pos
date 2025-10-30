import { CreditTopTabs } from '@/components/credit/CreditTopTabs';
import { useBusiness } from '@/contexts/BusinessContext';
import Sale from '@/db/models/sales';
import SaleItem from '@/db/models/sales_items';
import { useTransactions } from '@/hooks/useTransactions';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface TransactionItemInfo {
    transactionId: string;
    itemsPreview: string;
    itemCount: number;
    customerName?: string;
    categoryIcon?: string;
    categoryColor?: string;
}

const TransactionsScreen: React.FC = () => {
    const { transactions, isLoading, searchQuery } = useTransactions();
    const { selectedStore } = useBusiness();
    const [transactionItems, setTransactionItems] = useState<Map<string, TransactionItemInfo>>(
        new Map(),
    );

    useEffect(() => {
        const fetchItemsForTransactions = async () => {
            const itemsMap = new Map<string, TransactionItemInfo>();

            await Promise.all(
                transactions.map(async (transaction) => {
                    try {
                        const items = await transaction.items.fetch();
                        const itemCount = items.length;

                        let customerName: string | undefined;
                        if (transaction.customerId) {
                            try {
                                const customer = await transaction.customer?.fetch();
                                customerName = customer?.name;
                            } catch (error) {
                                customerName = undefined;
                            }
                        }

                        let categoryIcon: string | undefined;
                        let categoryColor: string | undefined;

                        if (itemCount > 0) {
                            try {
                                const firstItem = items[0];
                                const product = await firstItem.product.fetch();
                                const category = await product.category.fetch();
                                categoryIcon = category.icon;
                                categoryColor = category.color;
                            } catch (error) {
                                categoryIcon = undefined;
                            }
                        }

                        if (itemCount === 0) {
                            itemsMap.set(transaction.id, {
                                transactionId: transaction.id,
                                itemCount: 0,
                                itemsPreview: 'No items',
                                customerName,
                                categoryIcon,
                                categoryColor,
                            });
                            return;
                        }

                        const productNames = await Promise.all(
                            items.slice(0, 2).map(async (item: SaleItem) => {
                                const product = await item.product.fetch();
                                return product.name;
                            }),
                        );

                        const preview =
                            itemCount > 2
                                ? `${productNames.join(', ')} +${itemCount - 2} more`
                                : productNames.join(', ');

                        itemsMap.set(transaction.id, {
                            transactionId: transaction.id,
                            itemCount,
                            itemsPreview: preview,
                            customerName,
                            categoryIcon,
                            categoryColor,
                        });
                    } catch (error) {
                        console.error('Error fetching items for transaction:', error);
                        itemsMap.set(transaction.id, {
                            transactionId: transaction.id,
                            itemCount: 0,
                            itemsPreview: 'Error loading items',
                        });
                    }
                }),
            );

            setTransactionItems(itemsMap);
        };

        if (transactions.length > 0) {
            fetchItemsForTransactions();
        } else {
            setTransactionItems(new Map());
        }
    }, [transactions]);

    const getPaymentMethodColor = (method: string) => {
        switch (method.toLowerCase()) {
            case 'cash':
                return 'bg-green-100 text-green-700';
            case 'mpesa':
            case 'm-pesa':
                return 'bg-blue-100 text-blue-700';
            case 'store-credit':
                return 'bg-orange-100 text-orange-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const handleTransactionPress = async (transaction: Sale) => {
        if (!transaction || !transaction.id) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Transaction not found',
                position: 'bottom',
            });
            return;
        }

        try {
            console.log('sending  transaction:', transaction);
            router.push({
                pathname: '/credit/transaction-detail',
                params: { transactionId: transaction.id },
            });
        } catch (error) {
            console.error('Transaction fetch error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'This transaction no longer exists',
                position: 'bottom',
            });
        }
    };

    const todayTransactions = transactions.filter((t) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return t.createdAt >= today;
    });

    const todayRevenue = todayTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const todayProfit = todayRevenue * 0.36;

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <CreditTopTabs />
            <ScrollView className='flex-1'>
                <View className='p-4'>
                    <View className='bg-gray-100 rounded-lg p-4 mb-4'>
                        <Text className='text-base font-semibold mb-3'>
                            Today`&apos;`s Sales Summary
                        </Text>
                        <View className='flex-row justify-between'>
                            <View className='flex-1'>
                                <Text className='text-2xl font-bold text-gray-900'>
                                    {selectedStore!.currency} {todayRevenue.toFixed(2)}
                                </Text>
                                <Text className='text-sm text-gray-600'>Total Sales</Text>
                            </View>
                            <View className='flex-1 items-center'>
                                <Text className='text-2xl font-bold text-gray-900'>
                                    {todayTransactions.length}
                                </Text>
                                <Text className='text-sm text-gray-600'>Transactions</Text>
                            </View>
                            <View className='flex-1 items-end'>
                                <Text className='text-2xl font-bold text-green-600'>
                                    {selectedStore!.currency}
                                    {todayProfit.toFixed(2)}
                                </Text>
                                <Text className='text-sm text-gray-600'>Profit</Text>
                            </View>
                        </View>
                    </View>

                    <Text className='text-lg font-semibold mb-3'>Transaction History</Text>
                </View>

                {isLoading ? (
                    <View className='flex-1 items-center justify-center py-12'>
                        <ActivityIndicator size='large' color='#000' />
                        <Text className='mt-4 text-gray-500'>Loading transactions...</Text>
                    </View>
                ) : transactions.length === 0 ? (
                    <View className='flex-1 items-center justify-center py-12'>
                        <Ionicons name='receipt-outline' size={48} color='#9CA3AF' />
                        <Text className='mt-4 text-gray-500 text-center px-4'>
                            {searchQuery
                                ? 'No transactions found matching your search'
                                : 'No transactions yet'}
                        </Text>
                    </View>
                ) : (
                    <View className='px-4'>
                        {transactions.map((transaction) => {
                            const itemInfo = transactionItems.get(transaction.id);
                            const timeStr = new Date(transaction.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                            });
                            const isCredit = transaction.amountOnCredit > 0;

                            return (
                                <TouchableOpacity
                                    key={transaction.id}
                                    className='bg-white border border-gray-100 rounded-lg p-3 mb-2'
                                    onPress={() => handleTransactionPress(transaction)}>
                                    <View className='flex-row items-center justify-between'>
                                        <View className='flex-row items-center flex-1'>
                                            <View className='w-10 h-10 bg-orange-50 rounded items-center justify-center mr-3'>
                                                <Text className='text-2xl'>
                                                    {itemInfo?.categoryIcon || '📦'}
                                                </Text>
                                            </View>
                                            <View className='flex-1'>
                                                <View className='flex-row items-center gap-2'>
                                                    <Text className='font-semibold text-base'>
                                                        {timeStr}
                                                    </Text>
                                                    <View
                                                        className={`px-2 py-0.5 rounded-full ${getPaymentMethodColor(
                                                            isCredit
                                                                ? 'Credit'
                                                                : transaction.paymentMethod,
                                                        )}`}>
                                                        <Text className='text-xs font-medium'>
                                                            {isCredit
                                                                ? 'Credit'
                                                                : transaction.paymentMethod}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {itemInfo?.customerName && (
                                                    <Text className='text-sm text-gray-600 mt-0.5'>
                                                        Customer: {itemInfo.customerName}
                                                    </Text>
                                                )}
                                                <Text className='text-xs text-gray-500 mt-0.5'>
                                                    {itemInfo?.itemCount || 0} items
                                                </Text>
                                            </View>
                                        </View>
                                        <View className='items-end ml-2'>
                                            <Text
                                                className={`text-lg font-bold ${isCredit ? 'text-orange-600' : 'text-green-600'}`}>
                                                {selectedStore!.currency}
                                                {transaction.totalAmount.toFixed(2)}
                                            </Text>
                                            <TouchableOpacity>
                                                <View className='flex-row items-center mt-1'>
                                                    <Ionicons
                                                        name='eye-outline'
                                                        size={14}
                                                        color='#6B7280'
                                                    />
                                                    <Text className='text-xs text-gray-600 ml-1'>
                                                        View Details
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default TransactionsScreen;
