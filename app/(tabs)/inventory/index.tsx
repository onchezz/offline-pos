// import { AddProductModal } from '@/components/inventory/AddProductModal';

import { CategoriesGrid } from '@/components/inventory/category/CategoriesGrid';
import { InventoryHeader } from '@/components/inventory/InventoryHeader';
import { InventoryList } from '@/components/inventory/InventoryItemsList';
import { ProductModal } from '@/components/inventory/modal/productModal';
import { SearchAndFilterRow } from '@/components/inventory/SearchAndFilterRow';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { categoryService } from '@/db/services/categoryService';
import { inventoryService } from '@/db/services/inventoryService';
import { productService } from '@/db/services/productService';
import { useInventoryData } from '@/hooks/useInventoryData';
import { useInventoryFilters } from '@/hooks/useInventoryFilters';
import {
    CategoryData,
    InventoryItemData,
    InventoryUpdate,
    Product,
    ProductData,
    ProductUpdate,
} from '@/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Keyboard, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const InventoryTab = () => {
    const { user } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const { inventory, categories, rawCategories, loading, refreshinvetoryData } =
        useInventoryData();
    const { selectedBusiness, selectedStore } = useBusiness();

    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedFilter,
        toggleFilter,
        isSearchFocused,
        setIsSearchFocused,
        filteredData,
        getFilterText,
    } = useInventoryFilters(inventory);

    const handleCategoryPress = (category: any) => {
        setSelectedCategory(category.name);
        if (category.name !== 'All') {
            router.push({
                pathname: '/inventory/category',
                params: {
                    categoryId: category.id,
                    categoryName: category.name,
                },
            });
        }
    };

    const handleShowModal = () => {
        setShowAddModal(true);
    };
    const handleAddProduct = async (
        newPoduct: ProductData,
        newInventoryProductData: InventoryItemData,
    ) => {
        if (!selectedBusiness || !selectedStore || !user) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Missing business or store information',
                position: 'bottom',
            });
            return;
        }

        const product = await productService.createProduct({
            storeId: selectedBusiness.id,
            categoryId: newPoduct.categoryId,
            name: newPoduct.name,
            brand: newPoduct.brand,
            barcode: newPoduct.barcode,
            description: newPoduct.description,
            unit: newPoduct.unit || 'pcs',
            quantityPerUnit: newPoduct.quantityPerUnit || '1 pc',
            status: 'active',
        });

        await inventoryService.createInventory({
            productId: product.id,
            storeId: selectedStore.id,
            quantity: newInventoryProductData.quantity || 0,
            minStock: newInventoryProductData.minStock || 0,
            maxStock: newInventoryProductData.maxStock || 100,
            price: newInventoryProductData.price,
            wholeSalePrice: newInventoryProductData.wholeSalePrice || 0,
            weightedAvgCost: newInventoryProductData.price || 0,
            lastPurchasePrice: newInventoryProductData.price || 0,
            location: newInventoryProductData.location,
        });

        // console.log('Created product and inventory:', product, inventory);
        refreshinvetoryData();
    };

    const handleProductAdded = () => {
        refreshinvetoryData();
    };

    const handleCreateCategory = async (newCategoryData: CategoryData) => {
        if (!newCategoryData.name.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Category name is required',
                position: 'top',
            });
            return;
        }

        if (!selectedBusiness || !selectedStore) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'No business selected',
                position: 'top',
            });
            return;
        }
        const newCategory = await categoryService.createCategory({
            businessId: selectedBusiness.id,
            storeId: selectedStore.id,
            name: newCategoryData.name,
            icon: newCategoryData.icon,
            color: newCategoryData.color,
        });

        console.log('Create new category');
        refreshinvetoryData();
        return newCategory;
    };

    const handleUpdateProduct = async (productId: string, updates: ProductUpdate) => {
        console.log('Update product:', productId, updates);
        await productService.updateProduct(productId, updates);
    };

    const handleUpdateInventory = async (inventoryId: string, updates: InventoryUpdate) => {
        await inventoryService.updateInventoryPricing(inventoryId, updates);
    };

    const handleSaveItem = (updatedItem: Product) => {
        console.log('Save item:', updatedItem);
        refreshinvetoryData();
    };

    const handleDeleteItem = (itemId: string) => {
        console.log('Delete item:', itemId);
        refreshinvetoryData();
    };

    const dismissSearch = () => {
        setIsSearchFocused(false);
        Keyboard.dismiss();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        dismissSearch();
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <View className='bg-white px-4 py-3'>
                <InventoryHeader onShowModal={handleShowModal} />

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

                <CategoriesGrid
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryPress={handleCategoryPress}
                />
            </View>

            <InventoryList
                data={filteredData}
                filterText={getFilterText()}
                onSave={handleSaveItem}
                onDelete={handleDeleteItem}
                availableCategories={rawCategories}
                addCategory={handleCreateCategory}
                loadingCategories={loading}
                refreshCategories={refreshinvetoryData}
                updateProduct={handleUpdateProduct}
                updateInventory={handleUpdateInventory}
                storeCurrency={selectedStore?.currency || 'Kes'}
            />

            <ProductModal
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onProductAdded={handleProductAdded}
                categories={rawCategories}
                loadingCategories={loading}
                refreshCategories={refreshinvetoryData}
                addCategory={handleCreateCategory}
                addProduct={handleAddProduct}
            />
        </SafeAreaView>
    );
};

export default InventoryTab;
