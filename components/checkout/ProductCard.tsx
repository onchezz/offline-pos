import { Category, Product } from '@/types';
import { Minus, Plus } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
    storeCurrency: string;
    category: Category;
    product: Product;
    onAddToCart: (product: Product) => void;
    onRemoveFromCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    storeCurrency,
    category,
    product,
    onAddToCart,
    onRemoveFromCart,
}) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = (): void => {
        Animated.spring(scaleValue, {
            toValue: 0.98,
            useNativeDriver: true,
            tension: 400,
            friction: 10,
        }).start();
    };

    const handlePressOut = (): void => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 400,
            friction: 10,
        }).start();
    };

    const inCart = product.inCart || 0;
    const emptyProductInventory = product.quantity === undefined || product.quantity <= 0;

    return (
        <TouchableOpacity
            // onPressIn={handlePressIn}
            // onPressOut={handlePressOut}
            onPress={handlePressOut}
            activeOpacity={0.95}
            className='mb-1'>
            <Animated.View
                className='bg-white rounded-lg p-2'
                style={{
                    transform: [{ scale: scaleValue }],
                    shadowColor: '#D6D5D3',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.06,
                    shadowRadius: 6,
                    elevation: 3,
                }}>
                <View className='flex-row justify-between items-start mb-1'>
                    <View style={{ flex: 1 }}>
                        <Text className='text-sm font-medium text-gray-900 mb-0'>
                            {product.name}
                        </Text>
                        <Text className='text-sm font-bold text-gray-900 mb-0'>
                            ${product.price.toFixed(2)}
                        </Text>
                        <Text className='text-xs text-gray-600 mb-0'>{product.brand}</Text>

                        <Text className='text-xs text-gray-500 mb-0'>{product.barcode}</Text>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Text className='text-xs text-gray-500 mb-0'>
                            Stock :{product.quantity} {product.unit}
                        </Text>
                        {inCart > 0 && (
                            <View className='bg-red-500 rounded-full px-2 py-0.5 mt-1'>
                                <Text className='text-white text-xs font-medium'>{inCart}</Text>
                            </View>
                        )}
                    </View>
                </View>

                <Text className='text-xs text-gray-600 mb-1'>{product.description}</Text>

                {inCart > 0 ? (
                    <View className='flex-row items-center justify-between'>
                        <View className='flex-row items-center bg-gray-100 rounded-full'>
                            <TouchableOpacity
                                onPress={() => onRemoveFromCart(product)}
                                className='p-1'>
                                <Minus size={14} color='#374151' />
                            </TouchableOpacity>
                            <Text className='mx-2 font-medium text-gray-900'>{inCart}</Text>
                            <TouchableOpacity
                                onPress={() => onAddToCart(product)}
                                className='p-1'
                                disabled={inCart >= product.quantity!}>
                                <Plus size={14} color='#374151' />
                            </TouchableOpacity>
                        </View>
                        <Text className='text-sm font-bold text-gray-900'>
                            {storeCurrency} {(product.price * inCart).toFixed(2)}
                        </Text>
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={() => onAddToCart(product)}
                        disabled={emptyProductInventory}
                        className={`${emptyProductInventory ? 'bg-gray-500' : 'bg-gray-900'} rounded-lg py-2 px-3 flex-row items-center justify-center`}>
                        {!emptyProductInventory ? <Plus size={14} color='#FFFFFF' /> : <></>}
                        <Text className='text-white text-sm font-medium ml-2'>
                            {emptyProductInventory ? 'Empty inventory' : 'Add'}
                        </Text>
                    </TouchableOpacity>
                )}
                {/* <View className='flex-row items-center justify-between'>
                    <Text className='text-sm font-bold text-gray-900'>{product.description}</Text>
                </View> */}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default ProductCard;
