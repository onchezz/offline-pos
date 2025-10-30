import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
    DollarSign,
    TrendingUp,
    Receipt,
    BarChart3,
    CreditCard,
    ChevronDown,
} from 'lucide-react-native';
import { StatsCard } from './StatsCard';
import { TodayStats } from '@/types';

interface OverviewTabProps {
    stats: TodayStats;
    selectedPeriod: string;
    onPeriodChange: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
    stats,
    selectedPeriod,
    onPeriodChange,
}) => {
    return (
        <>
            {/* Today's Sales Header */}
            <View className='mb-4 flex-row justify-between items-center'>
                <View className='flex-row items-center'>
                    <DollarSign size={20} color='#374151' />
                    <Text className='ml-2 font-semibold text-gray-900'>Today&apos;s Sales</Text>
                </View>
                <TouchableOpacity
                    onPress={onPeriodChange}
                    className='flex-row items-center bg-gray-100 rounded-lg px-3 py-2'>
                    <Text className='text-sm text-gray-700 mr-1'>{selectedPeriod}</Text>
                    <ChevronDown size={16} color='#374151' />
                </TouchableOpacity>
            </View>

            {/* Sales Cards */}
            <View className='flex-row mb-4 gap-2'>
                <StatsCard
                    icon={TrendingUp}
                    iconColor='#10B981'
                    label='Revenue'
                    value={`$${stats.revenue.toFixed(2)}`}
                    bgColor='bg-gray-100'
                />
                <StatsCard
                    icon={Receipt}
                    iconColor='#3B82F6'
                    label='Orders'
                    value={stats.orders}
                    bgColor='bg-blue-50'
                />
            </View>

            <View className='flex-row mb-4 gap-2'>
                <StatsCard
                    icon={BarChart3}
                    iconColor='#10B981'
                    label='Profit'
                    value={`$${stats.profit.toFixed(2)}`}
                    valueColor='text-green-600'
                    bgColor='bg-green-50'
                />
                <StatsCard
                    icon={CreditCard}
                    iconColor='#F97316'
                    label='Net Credit'
                    value={`$${stats.netCredit.toFixed(2)}`}
                    valueColor='text-orange-600'
                    bgColor='bg-orange-50'
                />
            </View>
        </>
    );
};
