import { CartSummaryBar } from '@/components/checkout/CartSummaryBar';
import { CategoriesGrid } from '@/components/checkout/CategoriesGrid';
import {
    MostSoldItem,
    QuickReferenceSection,
} from '@/components/checkout/Quickreference/QuickReferenceSection';

import { Header } from '@/components/common/Header';
import { SearchBar } from '@/components/common/SearchBar';
import { useBusiness } from '@/contexts/BusinessContext';
import { mostSoldService } from '@/db/services/mostSoldService';
import { ScrollView, Switch, Text, View } from 'react-native';
// import { CATEGORIES } from '@/constants/categories';
import { useCart } from '@/contexts/CartContext';
import { useInventoryData } from '@/hooks/useInventoryData';
import { Category } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const ShopPOS: React.FC = () => {
    const { selectedStore } = useBusiness();
    const [isSearchFocused, setIsSearchFocused] = React.useState(false);
    const [searchText, setSearchText] = React.useState('');
    const [mostSoldItems, setMostSoldItems] = React.useState<MostSoldItem[]>([]);
    const [mostSoldLoading, setMostSoldLoading] = React.useState(true);

    React.useEffect(() => {
        const load = async () => {
            if (!selectedStore) {
                setMostSoldItems([]);
                setMostSoldLoading(false);
                return;
            }

            setMostSoldLoading(true);
            try {
                const products = await mostSoldService.getMostSoldProducts(selectedStore.id, 5);
                const items: MostSoldItem[] = products.map((p) => ({
                    // Use productId as the item id so cart entries reference the product record
                    // (previously inventoryId was used which caused product lookups to fail later)
                    id: p.productId,
                    name: p.productName,
                    price: p.price.toFixed(2),
                    wholeSalePrice: p.wholeSalePrice ? p.wholeSalePrice.toFixed(2) : undefined,
                    totalQuantity: p.currentStock,
                }));
                setMostSoldItems(items);
            } catch (err) {
                console.error('failed to load most sold', err);
                setMostSoldItems([]);
            } finally {
                setMostSoldLoading(false);
            }
        };

        load();
    }, [selectedStore]);

    const { inventory, categories, loading, refreshinvetoryData } = useInventoryData();

    const {
        cart,
        addToCart,
        updateQuantity,
        totalItems,
        totalPrice,
        wholesaleMode,
        setWholesaleMode,
    } = useCart();

    const handleCategoryPress = (category: Category) => {
        // Navigate to category screen with params
        router.push({
            pathname: '/(tabs)/checkout/category',
            params: {
                categoryId: category.id,
                categoryName: category.name,
            },
        });
    };

    const handleMainCartCheckout = () => {
        if (totalItems > 0) {
            // Navigate to payment screen
            router.push('/(tabs)/checkout/payment');
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <Header title={selectedStore ? selectedStore.name : 'Shop POS'}>
                <View className='flex-row items-center gap-2'>
                    <SearchBar
                        placeholder='Search products...'
                        isSearchFocused={isSearchFocused}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                    <View className='flex-row items-center'>
                        <Text className='text-sm text-gray-800 mr-2'>Wholesale</Text>
                        <Switch
                            value={wholesaleMode}
                            onValueChange={(v) => setWholesaleMode(v)}
                            disabled={!selectedStore?.wholesaleEnabled}
                        />
                    </View>
                </View>
            </Header>

            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <CategoriesGrid categories={categories} onCategoryPress={handleCategoryPress} />

                <QuickReferenceSection
                    loading={mostSoldLoading}
                    mostSoldItems={mostSoldItems}
                    cart={cart}
                    addToCart={addToCart}
                    updateQuantity={updateQuantity}
                    currencySymbol={selectedStore ? selectedStore.currency : 'Kes'}
                />
            </ScrollView>

            <CartSummaryBar
                totalItems={totalItems}
                totalPrice={totalPrice}
                onCheckout={handleMainCartCheckout}
                currencySymbol={selectedStore ? selectedStore.currency : 'Kes'}
            />
        </SafeAreaView>
    );
};

export default ShopPOS;
