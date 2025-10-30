import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthHeaderProps {
    title: string;
    subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
    return (
        <View className='items-center pt-16 pb-8'>
            <View className='w-16 h-16 bg-gray-900 rounded-full items-center justify-center mb-4'>
                <Ionicons name='storefront-outline' size={32} color='white' />
            </View>
            <Text className='text-3xl font-bold text-gray-900 mb-2'>{title}</Text>
            <Text className='text-base text-gray-600'>{subtitle}</Text>
        </View>
    );
}
