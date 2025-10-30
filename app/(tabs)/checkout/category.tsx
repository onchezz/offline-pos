import { CartSummaryBar } from '@/components/checkout/CartSummaryBar';
import { ProductList } from '@/components/checkout/ProductList';
import { CategoryHeader } from '@/components/common/CategoryHeader';
import { SearchBar } from '@/components/common/SearchBar';
import { useBusiness } from '@/contexts/BusinessContext';
import { useCart } from '@/contexts/CartContext';
import { useCategoryProducts } from '@/hooks/useCategoryProducts';
import { useInventoryData } from '@/hooks/useInventoryData';
import { Product } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const CategoryScreen: React.FC = () => {
    const { inventory, categories } = useInventoryData();
    const { categoryId } = useLocalSearchParams();
    const { selectedStore } = useBusiness();

    const category = categories.find((c) => c.id === categoryId);

    const {
        searchQuery,
        setSearchQuery,
        isSearchFocused,
        setIsSearchFocused,
        filteredData,
        stats,
    } = useCategoryProducts(category?.name || '', inventory);
    const { cart, totalItems, totalPrice, addToCart, updateQuantity } = useCart();

    if (!category) return null;

    // If the selected category is the special 'All' category, show all inventory items
    const itemsToDisplay =
        category?.id === 'all' || category?.name === 'All' ? inventory : filteredData;

    const productsForDisplay: Product[] = itemsToDisplay.map((i) => {
        const inCartEntry = cart.find((c) => c.id === i.productId);
        return {
            id: i.productId,
            name: i.name,
            brand: i.brand,
            barcode: i.barcode,
            category: i.category,
            price: i.price,
            quantity: i.quantity,
            stock: i.quantity,
            unit: i.unit,
            description: i.description,
            inCart: inCartEntry ? inCartEntry.quantity : 0,
        };
    });

    const handleAddToCart = (product: Product) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            inventory: product.quantity || 0,
        });
    };

    const handleRemoveFromCart = (product: Product) => {
        if (product.quantity === undefined) {
            console.warn('Product inventory quantity is undefined');
            return;
        }
        const cartItem = cart.find((item) => item.id === product.id);

        if (cartItem) {
            updateQuantity(product.id, cartItem.quantity - 1, product.quantity);
        }
    };

    const handleCheckout = () => {
        if (totalItems > 0) {
            router.push('/(tabs)/checkout/payment');
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <CategoryHeader
                category={category}
                productCount={productsForDisplay.length}
                onBack={() => router.back()}>
                <SearchBar
                    placeholder={`Search ${category.name.toLowerCase()}...`}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    isSearchFocused={isSearchFocused}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                />
            </CategoryHeader>

            <ProductList
                products={productsForDisplay}
                category={category}
                searchQuery={searchQuery}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                storeCurrency={selectedStore?.currency || 'kes'}
            />

            {totalItems > 0 && (
                <CartSummaryBar
                    totalItems={totalItems}
                    totalPrice={totalPrice}
                    onCheckout={handleCheckout}
                    currencySymbol={selectedStore?.currency || 'Kes'}
                />
            )}
        </SafeAreaView>
    );
};

export default CategoryScreen;
