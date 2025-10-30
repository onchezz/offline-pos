import { View, Text } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

// App Preferences Component
export function AppPreferences() {
    const [soundEffects, setSoundEffects] = useState(true);
    const [autoSaveCart, setAutoSaveCart] = useState(true);
    const [quickCheckout, setQuickCheckout] = useState(false);

    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4'>
            {/* Header */}
            <View className='flex-row items-center mb-4'>
                <Ionicons name='options-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>App Preferences</Text>
            </View>

            {/* Sound Effects */}
            <View className='mb-4'>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text className='font-medium text-base'>Sound Effects</Text>
                    <Text className='text-sm font-medium'>
                        {soundEffects ? 'Enabled' : 'Disabled'}
                    </Text>
                </View>
                <Text className='text-gray-500 text-sm'>
                    Play sounds for button taps and notifications
                </Text>
            </View>

            {/* Auto-Save Cart */}
            <View className='mb-4'>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text className='font-medium text-base'>Auto-Save Cart</Text>
                    <Text className='text-sm font-medium'>
                        {autoSaveCart ? 'Enabled' : 'Disabled'}
                    </Text>
                </View>
                <Text className='text-gray-500 text-sm'>
                    Automatically save cart items between sessions
                </Text>
            </View>

            {/* Quick Checkout */}
            <View>
                <View className='flex-row items-center justify-between mb-1'>
                    <Text className='font-medium text-base'>Quick Checkout</Text>
                    <Text className='text-sm font-medium'>
                        {quickCheckout ? 'Enabled' : 'Disabled'}
                    </Text>
                </View>
                <Text className='text-gray-500 text-sm'>
                    Enable one-tap checkout for cash payments
                </Text>
            </View>
        </View>
    );
}
