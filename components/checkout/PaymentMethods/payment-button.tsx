// components/checkout/PaymentButton.tsx
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface PaymentButtonProps {
    isProcessing: boolean;
    canProcess: boolean;
    error: string | null;
    roundedTotal: number;
    onPress: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
    isProcessing,
    canProcess,
    error,
    roundedTotal,
    onPress,
}) => {
    return (
        <View className='bg-white px-1 py-1 mt-2'>
            <TouchableOpacity
                onPress={onPress}
                className={`rounded-xl py-2 ${
                    !canProcess || isProcessing ? 'bg-gray-400' : 'bg-gray-900'
                }`}
                disabled={!canProcess || isProcessing}>
                <Text className='text-white text-center font-semibold text-lg'>
                    {isProcessing ? 'Processing...' : error || `Pay $${roundedTotal.toFixed(2)}`}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
