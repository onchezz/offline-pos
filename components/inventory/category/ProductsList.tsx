import { InventoryViewItem } from '@/types';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ProductItem } from './ProductItem';

interface ProductsListProps {
    data: InventoryViewItem[];
    onEditProduct: (item: InventoryViewItem) => void;
}

export const ProductsList: React.FC<ProductsListProps> = ({ data, onEditProduct }) => {
    return (
        <View className='flex-1'>
            <View className='flex-row justify-between items-center px-4 py-3'>
                <Text className='text-lg font-semibold text-gray-900'>Products</Text>
                <Text className='text-gray-600'>{data.length} products</Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => <ProductItem item={item} onEdit={onEditProduct} />}
            />
        </View>
    );
};
