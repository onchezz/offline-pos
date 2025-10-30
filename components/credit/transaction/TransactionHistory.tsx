import React from 'react';
import { Text, View } from 'react-native';
import { TransactionItem } from './TransactionItem';

interface Transaction {
    id: string;
    type: 'Purchase' | 'Payment';
    date: string;
    amount: number;
}

interface TransactionHistoryProps {
    transactions: Transaction[];
    onTransactionPress: (transaction: Transaction) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
    transactions,
    onTransactionPress,
}) => {
    return (
        <View className='mx-4 mt-6 mb-4'>
            <Text className='text-lg font-semibold mb-3'>Transaction History</Text>

            {transactions.map((transaction) => (
                <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onPress={onTransactionPress}
                />
            ))}
        </View>
    );
};
