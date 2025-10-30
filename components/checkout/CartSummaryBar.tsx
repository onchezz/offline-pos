import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CartSummaryBarProps {
    totalItems: number;
    totalPrice: number;
    onCheckout: () => void;
    disabled?: boolean;
    currencySymbol: string;
}

export const CartSummaryBar: React.FC<CartSummaryBarProps> = ({
    totalItems,
    totalPrice,
    onCheckout,
    disabled = false,
    currencySymbol,
}) => {
    const insets = useSafeAreaInsets();

    if (totalItems === 0) {
        return (
            <View
                className='bg-gray-500 mx-4 mb-2 rounded-xl p-4'
                style={{ marginBottom: -insets.bottom + 8 }}>
                <View className='flex-row'>
                    <ShoppingCart size={20} color='#FFFFFF' />
                    <Text className='text-white font-medium ml-2'>Cart Empty</Text>
                </View>
            </View>
        );
    }

    return (
        <TouchableOpacity
            onPress={onCheckout}
            disabled={disabled}
            className={`${disabled ? 'bg-gray-500' : 'bg-gray-900'} mx-4 mb-2 rounded-xl p-4`}
            style={{ marginBottom: -insets.bottom + 8 }}>
            <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center'>
                    <ShoppingCart size={20} color='#FFFFFF' />
                    <Text className='text-white font-medium ml-2'>Checkout</Text>
                </View>
                <View className='flex-row items-center'>
                    <Text className='text-white font-medium mr-3'>
                        {totalItems} item{totalItems > 1 ? 's' : ''}
                    </Text>
                    <Text className='text-white font-bold'>
                        {currencySymbol}
                        {totalPrice.toFixed(2)}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
