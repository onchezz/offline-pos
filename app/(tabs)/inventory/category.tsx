import { CategoryHeader } from '@/components/common/CategoryHeader';
import { CategoryStats } from '@/components/inventory/category/CategoryStats';
import { SearchAndFilterRow } from '@/components/inventory/SearchAndFilterRow';
// import { inventoryData } from '@/constants/sampleProducts';
import { useCategoryProducts } from '@/hooks/useCategoryProducts';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { ALL_CATEGORIES_WITH_ALL, CATEGORIES } from '@/constants/categories';
import { InventoryList } from '@/components/inventory/InventoryItemsList';
import { useBusiness } from '@/contexts/BusinessContext';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import { Product } from '@/types';

const CategoryDetailScreen: React.FC = () => {
    const { selectedBusiness } = useBusiness();

    // Get category from route params
    const { categoryId, categoryName } = useLocalSearchParams();
    const { inventory, categories } = useInventoryData();

    const category = categories.find((cat) => cat.id === categoryId);

    const {
        searchQuery,
        setSearchQuery,
        selectedFilter,
        toggleFilter,
        isSearchFocused,
        setIsSearchFocused,
        filteredData,
        stats,
    } = useCategoryProducts(category?.name || '', inventory);

    const { getFilterText } = useInventoryFilters(inventory);

    const handleEditProduct = (item: any) => {
        console.log('Edit product:', item);
    };

    const handleSaveItem = (updatedItem: Product) => {
        // Update your inventory data
        console.log('Save item:', updatedItem);
        // TODO: Update state/database with updatedItem
    };

    const handleDeleteItem = (itemId: string) => {
        // Delete item from inventory
        console.log('Delete item:', itemId);
        // TODO: Remove item from state/database
    };

    const dismissSearch = () => {
        setIsSearchFocused(false);
        Keyboard.dismiss();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        dismissSearch();
    };

    if (!category) {
        return null; // Or show error screen
    }

    return (
        <TouchableWithoutFeedback onPress={dismissSearch}>
            <SafeAreaView className='flex-1 bg-gray-50'>
                <View className='bg-white px-4 py-3'>
                    <CategoryHeader category={category} onBack={() => router.back()} />

                    <CategoryStats
                        totalItems={stats.totalItems}
                        lowStockItems={stats.lowStockItems}
                        outOfStockItems={stats.outOfStockItems}
                    />

                    <SearchAndFilterRow
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        isSearchFocused={isSearchFocused}
                        onSearchFocus={() => setIsSearchFocused(true)}
                        onSearchBlur={() => setIsSearchFocused(false)}
                        onClear={handleClearSearch}
                        selectedFilter={selectedFilter}
                        onToggleFilter={toggleFilter}
                    />
                </View>

                <InventoryList
                    data={filteredData}
                    filterText={getFilterText()}
                    onSave={handleSaveItem}
                    onDelete={handleDeleteItem}
                    availableCategories={categories}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default CategoryDetailScreen;
