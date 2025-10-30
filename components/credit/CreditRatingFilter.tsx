import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreditRatingBadge } from './CreditRatingBadge';

interface CreditRatingFilterProps {
    onClose: () => void;
}

export const CreditRatingFilter: React.FC<CreditRatingFilterProps> = ({ onClose }) => {
    return (
        <View className='flex-row items-center mb-4'>
            <View className='flex-row items-center bg-blue-50 rounded-lg px-3 py-2 mr-2'>
                <Text className='text-blue-600 text-sm mr-1'>Customer credit rating</Text>
                <Ionicons name='information-circle-outline' size={16} color='#2563eb' />
            </View>
            <CreditRatingBadge rating='Good' />
            <View className='ml-1'>
                <CreditRatingBadge rating='Medium' />
            </View>
            <View className='ml-1'>
                <CreditRatingBadge rating='Low' />
            </View>
            <TouchableOpacity className='ml-2' onPress={onClose}>
                <Ionicons name='close-circle-outline' size={20} color='#666' />
            </TouchableOpacity>
        </View>
    );
};
