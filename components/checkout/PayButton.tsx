import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PayButtonProps {
    onPress: () => void;
    amount: number;
    disabled?: boolean;
    currencySymbol: string;
}

export const PayButton: React.FC<PayButtonProps> = ({
    onPress,
    amount,
    disabled = false,
    currencySymbol,
}) => {
    // const insets = useSafeAreaInsets();

    return (
        <View className='bg-white px-4 py-4'>
            <TouchableOpacity
                onPress={onPress}
                className={`rounded-xl py-4 ${disabled ? 'bg-gray-300' : 'bg-gray-900'}`}
                disabled={disabled}>
                <Text className='text-white text-center font-semibold text-lg'>
                    Pay {currencySymbol}
                    {amount.toFixed(2)}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
