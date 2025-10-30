import Customer from '@/db/models/customers';
import { RatingType } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CreditRatingBadge } from './CreditRatingBadge';

interface CustomerCreditItemProps {
    customer: Customer;
    onPress?: (customer: Customer) => void;
    rating: RatingType;
    dueDate: string;
    amount: number;
    daysStatus: string;
    daysLeft: number;
}

export const CustomerCreditItem: React.FC<CustomerCreditItemProps> = ({
    customer,
    onPress,
    rating,
    dueDate,
    amount,
    daysStatus,
    daysLeft,
}) => {
    const getDaysLeftColor = (daysLeft: number) => {
        if (daysLeft <= 1) return 'text-red-500';
        if (daysLeft <= 3) return 'text-orange-500';
        return 'text-green-500';
    };

    return (
        <TouchableOpacity
            className='flex-row items-center justify-between py-4 border rounded-lg px-3 mb-2 border-gray-200'
            onPress={() => onPress?.(customer)}>
            <View className='flex-row items-center flex-1'>
                <View className='w-10 h-10items-center justify-center mr-3'>
                    <Ionicons name='person-outline' size={20} color='#666' />
                </View>
                <View className='flex-1'>
                    <View className='flex-row items-center mb-1'>
                        <Text className='font-semibold  mr-2 text-wrap text-ellipsis'>
                            {customer.name}
                        </Text>
                        <CreditRatingBadge rating={rating} />
                    </View>
                    <Text className='text-sm text-gray-500'>Due: {dueDate}</Text>
                </View>
            </View>
            <View className='items-end'>
                <Text className='font-semibold text-base mb-1'>
                    ${customer.currentBalance.toFixed(2)}
                </Text>
                <Text className={`text-xs font-medium ${getDaysLeftColor(daysLeft)}`}>
                    {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                </Text>
            </View>
        </TouchableOpacity>
    );
};
