import React from 'react';
import { Text, View } from 'react-native';
import { TransactionHistoryItem } from './TransactionHistoryItem';

interface HistoryTabProps {
    transactions?: {
        id: string;
        orderNumber: number;
        date: Date;
        amount: number;
    }[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({ transactions }) => {
    // Mock data if not provided
    const mockTransactions =
        transactions ||
        [1, 2, 3, 4, 5].map((item) => ({
            id: `txn-${item}`,
            orderNumber: 1000 + item,
            date: new Date(),
            amount: Math.random() * 50 + 10,
        }));

    const handleTransactionPress = (transaction: {
        id: string;
        orderNumber: number;
        date: Date;
        amount: number;
    }) => {
        console.log('Navigate to transaction:', transaction.id);
        // router.push({
        //   pathname: '/sales/transaction-detail',
        //   params: {
        //     transactionId: transaction.id,
        //     orderNumber: transaction.orderNumber.toString()
        //   }
        // });
    };

    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <Text className='mb-4 font-semibold text-gray-900'>Recent Transactions</Text>
            <View className='space-y-3'>
                {mockTransactions.map((transaction) => (
                    <TransactionHistoryItem
                        key={transaction.id}
                        transaction={transaction}
                        onPress={handleTransactionPress}
                    />
                ))}
            </View>
        </View>
    );
};
