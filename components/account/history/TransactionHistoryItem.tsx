import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Transaction {
    id: string;
    orderNumber: number;
    date: Date;
    amount: number;
}

interface TransactionHistoryItemProps {
    transaction: Transaction;
    onPress?: (transaction: Transaction) => void;
}

export const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
    transaction,
    onPress,
}) => {
    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            className='flex-row justify-between items-center py-3 border-b border-gray-100'
            onPress={() => onPress?.(transaction)}>
            <View>
                <Text className='font-medium text-gray-900'>Order #{transaction.orderNumber}</Text>
                <Text className='text-xs text-gray-500 mt-1'>
                    {transaction.date.toLocaleDateString()}{' '}
                    {transaction.date.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>
            <Text className='font-semibold text-gray-900'>${transaction.amount.toFixed(2)}</Text>
        </Component>
    );
};
