import { View, Text } from 'react-native';

import React from 'react';

interface SummaryCardProps {
    value: string;
    label: string;
    color?: 'default' | 'blue' | 'green';
    isCurrency?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
    value,
    label,
    color = 'default',
    isCurrency = false,
}) => {
    const getTextColor = () => {
        switch (color) {
            case 'blue':
                return 'text-blue-600';
            case 'green':
                return 'text-green-600';
            default:
                return 'text-black';
        }
    };

    const displayValue = isCurrency ? `$${value}.00` : value;

    return (
        <View className='bg-gray-100 rounded-lg p-4 mb-3'>
            <Text className={`text-2xl font-bold text-center ${getTextColor()}`}>
                {displayValue}
            </Text>
            <Text className='text-sm text-gray-600 text-center mt-1'>{label}</Text>
        </View>
    );
};
