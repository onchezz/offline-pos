import { SectionTitle } from '@/components/common/SectionTitle';
import { CartItem } from '@/types';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { QuickReferenceItem } from './QuickReferenceItem';
export type MostSoldItem = {
    id: string;
    name: string;
    price: string;
    wholeSalePrice?: string;
    totalQuantity: number;
};

type Props = {
    loading: boolean;
    mostSoldItems: MostSoldItem[];
    // cart handlers passed from parent
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    updateQuantity: (itemId: string, quantity: number, inventoryQantity: number) => void;
    currencySymbol: string;
};

export const QuickReferenceSection: React.FC<Props> = ({
    loading,
    mostSoldItems,
    cart,
    addToCart,
    updateQuantity,
    currencySymbol,
}) => {
    if (loading) {
        return (
            <View className='px-4 mt-6 mb-6'>
                <SectionTitle title='Quick Reference - Most Sold' />
                <View className='py-4 items-center'>
                    <ActivityIndicator size='small' color='#000' />
                </View>
            </View>
        );
    }

    if (mostSoldItems.length === 0) {
        return (
            <View className='px-4 mt-6 mb-6'>
                <SectionTitle title='Quick Reference - Most Sold' />
                <Text className='text-gray-500 text-center py-4'>No sales data available yet</Text>
            </View>
        );
    }

    return (
        <View className='px-4 mt-6 mb-6'>
            <SectionTitle title='Quick Reference' />
            {mostSoldItems.map((item) => {
                const cartEntry = cart.find((c) => c.id === item.id);
                const currentQuantity = cartEntry ? cartEntry.quantity : 0;

                return (
                    <QuickReferenceItem
                        key={item.id}
                        item={{
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            wholeSalePrice: item.wholeSalePrice,
                            totalQuantity: item.totalQuantity,
                        }}
                        currentQuantity={currentQuantity}
                        addToCart={addToCart}
                        updateQuantity={updateQuantity}
                        currencySymbol={currencySymbol}
                    />
                );
            })}
        </View>
    );
};
