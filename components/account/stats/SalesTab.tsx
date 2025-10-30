import React from 'react';
import { View, Text } from 'react-native';
import { TodayStats } from '@/types';

interface SalesTabProps {
    stats: TodayStats;
}

export const SalesTab: React.FC<SalesTabProps> = ({ stats }) => {
    const averageOrderValue = stats.orders > 0 ? (stats.revenue / stats.orders).toFixed(2) : '0.00';

    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <Text className='mb-4 font-semibold text-gray-900'>Sales Details</Text>
            <View className='space-y-3'>
                <View className='flex-row justify-between py-2 border-b border-gray-100'>
                    <Text className='text-gray-600'>Total Revenue</Text>
                    <Text className='font-semibold text-gray-900'>${stats.revenue.toFixed(2)}</Text>
                </View>
                <View className='flex-row justify-between py-2 border-b border-gray-100'>
                    <Text className='text-gray-600'>Total Orders</Text>
                    <Text className='font-semibold text-gray-900'>{stats.orders}</Text>
                </View>
                <View className='flex-row justify-between py-2 border-b border-gray-100'>
                    <Text className='text-gray-600'>Gross Profit</Text>
                    <Text className='font-semibold text-green-600'>${stats.profit.toFixed(2)}</Text>
                </View>
                <View className='flex-row justify-between py-2'>
                    <Text className='text-gray-600'>Average Order Value</Text>
                    <Text className='font-semibold text-gray-900'>${averageOrderValue}</Text>
                </View>
            </View>
        </View>
    );
};
