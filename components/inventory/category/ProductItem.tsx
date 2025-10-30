import { InventoryViewItem } from '@/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProductItemProps {
    item: InventoryViewItem;
    onEdit: (item: InventoryViewItem) => void;
}

export const ProductItem: React.FC<ProductItemProps> = ({ item, onEdit }) => {
    const isLowStock = typeof item.minStock === 'number' ? item.quantity <= item.minStock : false;
    const isOut = item.quantity === 0;

    const getBorderClass = () => {
        if (isLowStock) return 'border-2 border-orange-400';
        if (isOut) return 'border border-red-300';
        return 'border border-gray-100';
    };

    return (
        <View className={`bg-white rounded-lg mx-4 mb-2 px-4 py-3 ${getBorderClass()}`}>
            <View className='flex-row justify-between items-center'>
                <View className='flex-1'>
                    <View className='flex-row items-center mb-1'>
                        <Text className='text-base font-medium text-gray-900'>{item.name}</Text>
                        {isLowStock && (
                            <View className='bg-orange-500 px-2 py-0.5 rounded ml-2'>
                                <Text className='text-white text-xs font-semibold'>Low Stock</Text>
                            </View>
                        )}
                        {isOut && (
                            <View className='bg-red-500 px-2 py-0.5 rounded ml-2'>
                                <Text className='text-white text-xs font-semibold'>
                                    Out of Stock
                                </Text>
                            </View>
                        )}
                    </View>
                    <Text className='text-gray-600 text-sm'>
                        {item.category} | {item.barcode} | ${item.price.toFixed(2)} | {item.unit}
                    </Text>
                </View>
                <View className='items-end mr-3 flex-row items-center'>
                    <Text
                        className={`text-xs font-bold mr-1 ${
                            isLowStock ? 'text-orange-500' : 'text-gray-600'
                        }`}>
                        {item.quantity}
                    </Text>
                    <Text
                        className={`text-xs ${
                            isLowStock ? 'text-orange-500 font-medium' : 'text-gray-600'
                        }`}>
                        {item.quantity === 1 ? 'item' : 'items'}
                    </Text>
                </View>
                <TouchableOpacity
                    className='w-6 h-6 bg-gray-100 rounded items-center justify-center'
                    onPress={() => onEdit(item)}>
                    <Feather name='edit' size={14} color='#6B7280' />
                </TouchableOpacity>
            </View>
        </View>
    );
};
