import { View, Text } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export function Notifications() {
    const [lowStockAlerts, setLowStockAlerts] = useState(true);
    const [dailySalesSummary, setDailySalesSummary] = useState(true);
    const [paymentConfirmations, setPaymentConfirmations] = useState(true);

    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4'>
            {/* Header */}
            <View className='flex-row items-center mb-4'>
                <Ionicons name='notifications-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Notifications</Text>
            </View>

            {/* Low Stock Alerts */}
            <View className='mb-4'>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text className='font-medium text-base'>Low Stock Alerts</Text>
                    <Text className='text-sm font-medium'>
                        {lowStockAlerts ? 'Enabled' : 'Disabled'}
                    </Text>
                </View>
                <Text className='text-gray-500 text-sm'>
                    Get notified when products are running low
                </Text>
            </View>

            {/* Daily Sales Summary */}
            <View className='mb-4'>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text className='font-medium text-base'>Daily Sales Summary</Text>
                    <Text className='text-sm font-medium'>
                        {dailySalesSummary ? 'Enabled' : 'Disabled'}
                    </Text>
                </View>
                <Text className='text-gray-500 text-sm'>Receive end-of-day sales reports</Text>
            </View>

            {/* Payment Confirmations */}
            <View>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text className='font-medium text-base'>Payment Confirmations</Text>
                    <Text className='text-sm font-medium'>
                        {paymentConfirmations ? 'Enabled' : 'Disabled'}
                    </Text>
                </View>
                <Text className='text-gray-500 text-sm'>
                    Show confirmation for each completed payment
                </Text>
            </View>
        </View>
    );
}
