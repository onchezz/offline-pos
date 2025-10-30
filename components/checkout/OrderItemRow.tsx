import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DiscountPopover from './discount/DiscountPopover';

interface OrderItemRowProps {
    item: CartItem;
    onDiscountChange?: (itemId: string, discount: number, mode?: 'percent' | 'amount') => void;
    currency: string;
}

export const OrderItemRow: React.FC<OrderItemRowProps> = ({ item, onDiscountChange, currency }) => {
    const { updateQuantity, removeFromCart, updateDiscount } = useCart();

    const [expanded, setExpanded] = useState(true);

    // derived values
    const lineTotal = useMemo(() => item.price * item.quantity, [item.price, item.quantity]);
    const currentDiscount = item.discount || 0;
    const discountedLineTotal = Math.max(0, lineTotal - currentDiscount);

    // Discount actions are handled by DiscountPopover and propagated via onDiscountChange

    const handleIncrease = () => {
        updateQuantity(item.id, item.quantity + 1, item.inventory);
    };

    const handleDecrease = () => {
        const next = item.quantity - 1;
        if (next <= 0) removeFromCart(item.id);
        else updateQuantity(item.id, next, item.inventory);
    };

    const handleRemove = () => removeFromCart(item.id);

    const applyDiscount = (discountAmount: number, mode: 'percent' | 'amount') => {
        // prefer callback from parent if provided (OrderSummary -> payment) so it can persist mode
        if (onDiscountChange) onDiscountChange(item.id, discountAmount, mode);
        else updateDiscount(item.id, discountAmount, mode);
    };

    const removeDiscount = () => {
        if (onDiscountChange) onDiscountChange(item.id, 0, item.discountMode || 'amount');
        else updateDiscount(item.id, 0, item.discountMode || 'amount');
    };

    return (
        <View className='mb-2 mx-2'>
            <View className='bg-white rounded-lg p-2 border border-gray-100 shadow-sm'>
                <TouchableOpacity onPress={() => setExpanded((v) => !v)} activeOpacity={0.9}>
                    <View className='flex-row justify-between items-start'>
                        <View className='flex-1 pr-3'>
                            <Text className='text-gray-900 font-semibold text-sm' numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text className='text-gray-500 text-xs mt-0'>
                                {currency}
                                {item.price.toFixed(2)} × {item.quantity}
                            </Text>
                        </View>

                        <View className='items-end'>
                            {currentDiscount > 0 ? (
                                <Text className='text-green-600 text-xs line-through'>
                                    {currency}
                                    {item.price.toFixed(2)}
                                </Text>
                            ) : (
                                <Text className='text-transparent'>.</Text>
                            )}

                            <Text className='text-gray-900 text-sm font-bold mt-0'>
                                {currency}
                                {discountedLineTotal.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {currentDiscount > 0 && (
                    <View className='mt-2 bg-green-50 rounded-md p-1 flex-row justify-between items-center'>
                        <View className='flex-row items-center'>
                            <Feather name='tag' size={10} color='#059669' />

                            <Text className='text-green-700 text-xs ml-2'>
                                {item.discountMode === 'percent'
                                    ? `${Math.round((currentDiscount / lineTotal) * 100)}% off`
                                    : `${currency}${currentDiscount.toFixed(2)} off`}
                            </Text>
                        </View>
                        <Text className='text-green-700 font-semibold text-xs'>
                            {'-' + currency + currentDiscount.toFixed(2)}
                        </Text>
                    </View>
                )}

                {expanded && (
                    <View className='mt-2 flex-row items-center justify-between'>
                        <View className='flex-row items-center space-x-2'>
                            <TouchableOpacity
                                onPress={handleDecrease}
                                accessibilityLabel={`Decrease quantity for ${item.name}`}
                                className='w-7 h-7 rounded-md border border-gray-200 items-center justify-center'>
                                <Text className='text-base text-gray-700'>−</Text>
                            </TouchableOpacity>

                            <View className='px-1'>
                                <Text className='text-gray-900 font-medium text-sm'>
                                    {item.quantity}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleIncrease}
                                accessibilityLabel={`Increase quantity for ${item.name}`}
                                className='w-7 h-7 rounded-md border border-gray-200 items-center justify-center'>
                                <Text className='text-base text-gray-700'>+</Text>
                            </TouchableOpacity>
                        </View>

                        <View className='flex-row items-center justify-evenly space-x-2'>
                            <DiscountPopover
                                label={currentDiscount > 0 ? 'Edit' : 'Discount'}
                                currentDiscount={currentDiscount}
                                currentMode={
                                    (item.discountMode as 'percent' | 'amount') || 'amount'
                                }
                                lineTotal={lineTotal}
                                onApply={applyDiscount}
                                onRemove={removeDiscount}
                            />

                            <TouchableOpacity
                                onPress={handleRemove}
                                accessibilityLabel={`Remove ${item.name}`}
                                className='w-7 h-7 ml-1 rounded-md bg-red-500 items-center justify-center'>
                                <Ionicons name='close' size={16} color='#fff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};
