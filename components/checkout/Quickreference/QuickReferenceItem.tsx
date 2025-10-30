import { useCart } from '@/contexts/CartContext';
import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity } from 'react-native';

import { QuantityControls } from '@/components/common/QuantityControls';
import { AddButton } from '@/components/ui/ActionButton';
import { CartItem } from '@/types';

type QuickReferenceItemProps = {
    item: {
        id: string;
        name: string;
        price: string;
        wholeSalePrice?: string;
        totalQuantity: number;
    };
    addToCart: (item: CartItem) => void;
    updateQuantity: (itemId: string, qty: number, inventoryQantity: number) => void;
    currentQuantity?: number;
    currencySymbol: string;
};

export const QuickReferenceItem: React.FC<QuickReferenceItemProps> = ({
    item,
    // addToCart,
    // updateQuantity,
    currentQuantity = 0,
    currencySymbol,
}) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const {
        cart,
        addToCart: addToCartContext,
        updateQuantity: updateQuantityContext,
        wholesaleMode,
    } = useCart();

    const cartItem = cart.find((cartItem) => cartItem.id === item.id);
    // const currentQuantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        const priceValue =
            wholesaleMode && item.wholeSalePrice
                ? parseFloat(item.wholeSalePrice)
                : parseFloat(item.price);
        addToCartContext({
            id: item.id,
            name: item.name,
            price: priceValue,
            quantity: 1,
            inventory: item.totalQuantity,
        });
    };

    const handleIncrease = () => {
        if (cartItem) {
            updateQuantityContext(item.id, cartItem.quantity + 1, item.totalQuantity);
        }
    };

    const handleDecrease = () => {
        if (cartItem) {
            updateQuantityContext(item.id, cartItem.quantity - 1, item.totalQuantity);
        }
    };

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

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.95}
            className='mb-2'>
            <Animated.View
                className='flex-row items-center justify-between py-3 px-4 bg-white rounded-lg'
                style={{
                    transform: [{ scale: scaleValue }],
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 1.5,
                }}>
                <Text className='text-gray-800 font-medium flex-1'>{item.name}</Text>
                <Text className='text-gray-600 font-medium mr-3'>
                    {currencySymbol}
                    {wholesaleMode && item.wholeSalePrice ? item.wholeSalePrice : item.price}
                </Text>

                {currentQuantity > 0 ? (
                    <QuantityControls
                        quantity={currentQuantity}
                        onIncrease={handleIncrease}
                        onDecrease={handleDecrease}
                        size='sm'
                        variant='primary'
                    />
                ) : (
                    <AddButton onPress={handleAddToCart} size='sm' />
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};
