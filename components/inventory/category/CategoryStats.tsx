import React from 'react';
import { View, Text } from 'react-native';

interface CategoryStatsProps {
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
}

export const CategoryStats: React.FC<CategoryStatsProps> = ({
    totalItems,
    lowStockItems,
    outOfStockItems,
}) => {
    return (
        <View className='flex-row items-center mb-4'>
            <Text className='text-gray-600 text-sm mr-4'>{totalItems} items</Text>
            <Text className='text-gray-600 text-sm mr-4'>•</Text>
            <Text className='text-gray-600 text-sm mr-4'>{lowStockItems} low stock</Text>
            <Text className='text-gray-600 text-sm mr-4'>•</Text>
            <Text className='text-gray-600 text-sm'>{outOfStockItems} out of stock</Text>
        </View>
    );
};
