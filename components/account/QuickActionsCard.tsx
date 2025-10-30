import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Zap, CreditCard, Receipt, ChevronRight } from 'lucide-react-native';

interface QuickActionsCardProps {
    onManageCredit: () => void;
    onSalesHistory: () => void;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
    onManageCredit,
    onSalesHistory,
}) => {
    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='flex-row items-center mb-4'>
                <Zap size={20} color='#374151' />
                <Text className='ml-2 font-semibold text-gray-900'>Quick Actions</Text>
            </View>

            <TouchableOpacity
                onPress={onManageCredit}
                className='flex-row items-center p-3 mb-3 bg-orange-50 rounded-xl'>
                <View className='w-10 h-10 bg-orange-500 rounded-lg items-center justify-center'>
                    <CreditCard size={20} color='#FFFFFF' />
                </View>
                <View className='ml-3 flex-1'>
                    <Text className='font-semibold text-gray-900'>Manage Credit</Text>
                    <Text className='text-xs text-gray-500'>View customer accounts</Text>
                </View>
                <ChevronRight size={20} color='#9CA3AF' />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onSalesHistory}
                className='flex-row items-center p-3 bg-blue-50 rounded-xl'>
                <View className='w-10 h-10 bg-blue-500 rounded-lg items-center justify-center'>
                    <Receipt size={20} color='#FFFFFF' />
                </View>
                <View className='ml-3 flex-1'>
                    <Text className='font-semibold text-gray-900'>Sales History</Text>
                    <Text className='text-xs text-gray-500'>View recent transactions</Text>
                </View>
                <ChevronRight size={20} color='#9CA3AF' />
            </TouchableOpacity>
        </View>
    );
};
