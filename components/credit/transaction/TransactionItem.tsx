import { DollarSign, Receipt, Wallet } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Transaction {
    id: string;
    type: 'Purchase' | 'Payment';
    date: string;
    amount: number;
}

interface TransactionItemProps {
    transaction: Transaction;
    onPress: (transaction: Transaction) => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onPress }) => {
    return (
        <TouchableOpacity
            className='bg-white rounded-lg p-4 mb-2 flex-row items-center shadow-sm active:bg-gray-50'
            onPress={() => onPress(transaction)}>
            <View className='w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3'>
                {transaction.type === 'Purchase' ? (
                    <Wallet size={20} color='#666' />
                ) : (
                    <DollarSign size={20} color='#666' />
                )}
            </View>
            <View className='flex-1'>
                <View
                    className={`self-start px-2 py-1 rounded ${
                        transaction.type === 'Purchase' ? 'bg-red-500' : 'bg-gray-800'
                    }`}>
                    <Text className='text-white text-xs font-medium'>{transaction.type}</Text>
                </View>
                <Text className='text-sm text-gray-500 mt-1'>{transaction.date}</Text>
            </View>
            <Text
                className={`text-lg font-semibold ${
                    transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
            </Text>
        </TouchableOpacity>
    );
};
