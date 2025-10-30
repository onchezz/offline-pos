import React from 'react';
import { View, Text } from 'react-native';
import { CreditCard, Minus, Plus, Calendar, Clock } from 'lucide-react-native';

interface CreditOverviewCardProps {
    currentBalance: number;
    totalCredits: number;
    totalPayments: number;
    dueDate: string;
    daysLeft: number;
}

export const CreditOverviewCard: React.FC<CreditOverviewCardProps> = ({
    currentBalance,
    totalCredits,
    totalPayments,
    dueDate,
    daysLeft,
}) => {
    return (
        <View className='mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm'>
            <View className='flex-row justify-items-center items-center mb-4'>
                <CreditCard size={20} color='#000' />
                <Text className='text-base font-semibold ml-2 '>Credit Overview</Text>
            </View>

            {/* Current Balance */}
            <View className='bg-gray-50 rounded-lg p-4 mb-4'>
                <Text className='text-sm text-gray-600 text-center mb-1'>
                    Current Credit Balance
                </Text>
                <Text className='text-4xl font-bold text-red-600 text-center'>
                    ${currentBalance.toFixed(2)}
                </Text>
                <Text className='text-sm text-gray-500 text-center mt-1'>Outstanding</Text>
            </View>

            {/* Credits and Payments Row */}
            <View className='flex-row justify-between mb-4'>
                <View className='flex-1'>
                    <View className='flex-row items-center mb-1'>
                        <Minus size={16} color='#ef4444' />
                        <Text className='text-sm text-gray-600 ml-1'>Total Credits</Text>
                    </View>
                    <Text className='text-lg font-semibold text-red-600'>
                        ${totalCredits.toFixed(2)}
                    </Text>
                </View>
                <View className='w-px bg-gray-200 mx-4' />
                <View className='flex-1'>
                    <View className='flex-row items-center mb-1'>
                        <Plus size={16} color='#10b981' />
                        <Text className='text-sm text-gray-600 ml-1'>Total Payments</Text>
                    </View>
                    <Text className='text-lg font-semibold text-green-600'>
                        ${totalPayments.toFixed(2)}
                    </Text>
                </View>
            </View>

            {/* Due Date and Status */}
            <View className='flex-row justify-between'>
                <View className='flex-1'>
                    <View className='flex-row items-center mb-1'>
                        <Calendar size={16} color='#666' />
                        <Text className='text-sm text-gray-600 ml-1'>Due Date</Text>
                    </View>
                    <Text className='text-base font-medium'>{dueDate}</Text>
                </View>
                <View className='w-px bg-gray-200 mx-4' />
                <View className='flex-1'>
                    <View className='flex-row items-center mb-1'>
                        <Clock size={16} color='#666' />
                        <Text className='text-sm text-gray-600 ml-1'>Status</Text>
                    </View>
                    <Text
                        className={`text-base font-medium ${daysLeft <= 1 ? 'text-red-500' : 'text-green-500'}`}>
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                    </Text>
                </View>
            </View>
        </View>
    );
};
