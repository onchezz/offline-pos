import { useState } from 'react';
import { Category, CartItem, Screen } from '@/types';

interface NavigationState {
    currentScreen: Screen;
    selectedCategory?: Category;
    cartItems?: CartItem[];
}

export const useNavigation = () => {
    const [navigation, setNavigation] = useState<NavigationState>({
        currentScreen: 'main',
    });

    const navigateToCheckoutCategory = (category: Category) => {
        setNavigation({
            currentScreen: 'checkout-category',
            selectedCategory: category,
        });
    };

    const navigateToInventoryCategory = (category: Category) => {
        setNavigation({
            currentScreen: 'inventory-category',
            selectedCategory: category,
        });
    };

    const navigateToCheckout = (cartItems: CartItem[]) => {
        setNavigation({
            currentScreen: 'checkout',
            cartItems,
        });
    };

    const navigateToInventory = (cartItems: CartItem[]) => {
        setNavigation({
            currentScreen: 'inventory',
            cartItems,
        });
    };

    const navigateBack = () => {
        setNavigation({ currentScreen: 'main' });
    };

    return {
        navigation,
        navigateToCheckoutCategory,
        navigateToInventoryCategory,
        navigateToInventory,
        navigateToCheckout,
        navigateBack,
    };
};
