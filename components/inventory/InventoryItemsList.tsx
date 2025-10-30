import Category from '@/db/models/categories';
import {
    CategoryData,
    CategoryItem,
    InventoryUpdate,
    InventoryViewItem,
    ProductUpdate,
} from '@/types';
import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { InventoryItem } from './InventoryItem';

interface InventoryListProps {
    data: InventoryViewItem[];
    storeCurrency: string;
    filterText: string | undefined;
    onSave: (updatedItem: InventoryViewItem) => void;
    onDelete: (itemId: string) => void;
    availableCategories: CategoryItem[];
    addCategory?: (newCategoryData: CategoryData) => Promise<Category | undefined>;
    loadingCategories?: boolean;
    refreshCategories?: () => Promise<void>;

    updateProduct?: (productId: string, updates: ProductUpdate) => Promise<void>;
    updateInventory?: (inventoryId: string, updates: InventoryUpdate) => Promise<void>;
}

export const InventoryList: React.FC<InventoryListProps> = ({
    data,
    storeCurrency,
    filterText,
    onSave,
    onDelete,
    availableCategories,
    addCategory,
    loadingCategories,
    refreshCategories,
    updateProduct,
    updateInventory,
}) => {
    return (
        <View className='flex-1'>
            <View className='flex-row justify-between items-center px-4 py-3'>
                <Text className='text-lg font-semibold text-gray-900'>Inventory Items</Text>
                <Text className='text-gray-600'>{filterText}</Text>
            </View>

            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <InventoryItem
                        item={item}
                        onSave={onSave}
                        onDelete={onDelete}
                        availableCategories={availableCategories}
                        addCategory={addCategory}
                        loadingCategories={loadingCategories}
                        refreshCategories={refreshCategories}
                        updateProduct={updateProduct}
                        updateInventory={updateInventory}
                        storeCurrency={storeCurrency}
                    />
                )}
            />
        </View>
    );
};
