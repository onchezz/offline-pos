import { ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CartSummaryBarProps {
    handleMainCartCheckout: () => void;
    totalCartItems: number;
    totalCartPrice: number;
    marginBottom: number;
}

const CartSummaryBar: React.FC<CartSummaryBarProps> = ({
    totalCartItems,
    totalCartPrice,
    handleMainCartCheckout,
    marginBottom,
}) => {
    return (
        <TouchableOpacity
            onPress={handleMainCartCheckout}
            className='bg-gray-900 mx-4 mb-2 rounded-xl p-4'
            style={{ marginBottom }}>
            <View className='flex-row items-center justify-between'>
                <View className='flex-row items-center'>
                    <ShoppingCart size={20} color='#FFFFFF' />
                    <Text className='text-white font-medium ml-2'>Checkout</Text>
                </View>
                <View className='flex-row items-center'>
                    <Text className='text-white font-medium mr-3'>
                        {totalCartItems} item{totalCartItems > 1 ? 's' : ''}
                    </Text>
                    <Text className='text-white font-bold'>${totalCartPrice.toFixed(2)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default CartSummaryBar;
