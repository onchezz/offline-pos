import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeft, Trash2 } from 'lucide-react-native';
import { CreditRatingBadge } from '../CreditRatingBadge';
import { CreditRating } from '@/types';

interface CustomerDetailHeaderProps {
    customerName: string;
    phoneNumber: string;
    rating: CreditRating;
    onBack: () => void;
    onDelete: () => void;
}

export const CustomerDetailHeader: React.FC<CustomerDetailHeaderProps> = ({
    customerName,
    phoneNumber,
    rating,
    onBack,
    onDelete,
}) => {
    return (
        <View className='bg-white px-4 py-3 flex-row items-center justify-between border-b border-gray-200'>
            <View className='flex-row items-center flex-1'>
                <TouchableOpacity className='mr-3' onPress={onBack}>
                    <ChevronLeft size={24} color='#000' />
                </TouchableOpacity>
                <View className='flex-1'>
                    <Text className='text-xl font-semibold'>{customerName}</Text>
                    <Text className='text-sm text-gray-500'>{phoneNumber}</Text>
                </View>
            </View>
            <View className='flex-row items-center'>
                <View className='mr-2'>
                    <CreditRatingBadge rating={rating} size='md' />
                </View>
                <TouchableOpacity onPress={onDelete}>
                    <Trash2 size={22} color='#ef4444' />
                </TouchableOpacity>
            </View>
        </View>
    );
};
