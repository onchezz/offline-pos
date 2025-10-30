import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TransactionDetailHeaderProps {
    customerName: string;
    transactionType: 'Purchase' | 'Payment';
    onBack: () => void;
}

export const TransactionDetailHeader: React.FC<TransactionDetailHeaderProps> = ({
    customerName,
    transactionType,
    onBack,
}) => {
    return (
        <View className='bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200'>
            <View className='flex-row items-center flex-1'>
                <TouchableOpacity className='mr-3' onPress={onBack}>
                    <ChevronLeft size={24} color='#000' />
                </TouchableOpacity>
                <View className='flex-1'>
                    <Text className='text-xl font-semibold'>Credit Transaction</Text>
                    <Text className='text-sm text-gray-500'>{customerName}</Text>
                </View>
            </View>
            <View
                className={`px-3 py-1 rounded ${
                    transactionType === 'Purchase' ? 'bg-red-500' : 'bg-gray-800'
                }`}>
                <Text className='text-white text-xs font-medium'>{transactionType}</Text>
            </View>
        </View>
    );
};
