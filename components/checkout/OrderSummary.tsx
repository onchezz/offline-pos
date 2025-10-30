import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Customer from '@/db/models/customers';
import { MaterialIcons } from '@expo/vector-icons';
import { OrderItemRow } from './OrderItemRow';
import CustomerPopover from './customer/CustomerPopover';

interface OrderSummaryProps {
    cartItems: CartItem[];
    total: number;
    onItemDiscountChange?: (itemId: string, discount: number) => void;
    // customer popover props
    customerQuery?: string;
    customerResults?: any[];
    onCustomerQueryChange?: (q: string) => void;
    onSelectCustomer?: (c: Customer | null) => void;
    // onCreateCustomer?: (data: { name?: string; phone?: string; email?: string }) => void;
    selectedCustomer?: Customer | null;
    onOpenAddCustomerModal: () => void;
    currency: string;
    // onExcludeCustomer?: (id: string) => void;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    cartItems,
    total,
    onItemDiscountChange,
    customerQuery,
    customerResults = [],
    onCustomerQueryChange,
    onSelectCustomer,
    // onCreateCustomer,
    selectedCustomer,
    onOpenAddCustomerModal,
    currency,
    // onExcludeCustomer,
}) => {
    const { updateDiscount } = useCart();
    return (
        <View className='bg-white mx-4 px-4 pt-2 rounded-lg p-1 border border-gray-200'>
            <View className='flex-row justify-between items-center my-2 mx-4'>
                <Text className='text-sm font-semibold text-gray-900'>Order Summary</Text>

                <View className='flex-row items-center gap-2'>
                    <CustomerPopover
                        customer={selectedCustomer}
                        query={customerQuery || ''}
                        results={customerResults || []}
                        onQueryChange={onCustomerQueryChange || (() => {})}
                        onSelectCustomer={onSelectCustomer || (() => {})}
                        onOpenAddCustomerModal={onOpenAddCustomerModal}
                    />
                    {selectedCustomer && (
                        <Pressable onPress={() => onSelectCustomer && onSelectCustomer(null)}>
                            <MaterialIcons name='delete-outline' size={20} color='red' />
                        </Pressable>
                    )}
                </View>
            </View>
            <View className='mt-3'>
                {cartItems.map((item) => (
                    <OrderItemRow
                        key={item.id}
                        item={item}
                        onDiscountChange={(
                            itemId: string,
                            discount: number,
                            mode?: 'percent' | 'amount',
                        ) => {
                            if (onItemDiscountChange) onItemDiscountChange(itemId, discount);
                            else updateDiscount(itemId, discount, mode);
                        }}
                        currency={currency}
                    />
                ))}
            </View>

            <View className='border-t border-gray-200 pt-2 mb-3 mx-3'>
                <View className='flex-row justify-between items-center'>
                    <Text className='text-xs text-gray-600'>Subtotal</Text>
                    <Text className='text-sm text-gray-900'>
                        {currency}
                        {total.toFixed(2)}
                    </Text>
                </View>

                {cartItems.some((item) => (item.discount ?? 0) > 0) && (
                    <View className='flex-row justify-between items-center mt-1'>
                        <Text className='text-xs text-red-600'>Total Discount</Text>
                        <Text className='text-xs text-red-600'>
                            -{currency}
                            {cartItems
                                .reduce((sum, item) => sum + (item.discount ?? 0), 0)
                                .toFixed(2)}
                        </Text>
                    </View>
                )}

                <View className='flex-row justify-between items-center'>
                    <Text className='text-base font-semibold text-gray-900'>Total</Text>
                    <Text className='text-base font-semibold text-gray-900'>
                        {currency}
                        {(
                            total - cartItems.reduce((sum, item) => sum + (item.discount ?? 0), 0)
                        ).toFixed(2)}
                    </Text>
                </View>
            </View>
        </View>
    );
};
