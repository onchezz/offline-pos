import { CartItem } from '@/types';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useBusiness } from './BusinessContext';

export interface CartContextValue {
    cart: CartItem[];
    totalItems: number;
    totalPrice: number;
    totalDiscount: number;
    finalPrice: number;
    wholesaleMode: boolean;
    setWholesaleMode: (v: boolean) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number, inventoryQantity: number) => void;
    updateDiscount: (itemId: string, discount: number, mode?: 'percent' | 'amount') => void;
    clearCart: () => void;
    setCart: (items: CartItem[]) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { selectedStore } = useBusiness();
    const [cart, setCartState] = useState<CartItem[]>([]);
    const [wholesaleMode, setWholesaleMode] = useState<boolean>(false);

    const totalItems = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    }, [cart]);

    const totalPrice = useMemo(() => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cart]);

    const totalDiscount = useMemo(() => {
        return cart.reduce((sum, item) => sum + (item.discount || 0), 0);
    }, [cart]);

    const finalPrice = useMemo(() => {
        return totalPrice - totalDiscount;
    }, [totalPrice, totalDiscount]);

    const addToCart = useCallback(async (item: CartItem) => {
        if (item.quantity <= item.inventory) {
            setCartState((prevCart) => {
                const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
                if (existingItem) {
                    return prevCart.map((cartItem) =>
                        cartItem.id === item.id
                            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                            : cartItem,
                    );
                }
                return [...prevCart, item];
            });
            // Optionally, you can throw an error or notify the user here
        }
    }, []);

    const removeFromCart = useCallback((itemId: string) => {
        setCartState((prevCart) => prevCart.filter((item) => item.id !== itemId));
    }, []);

    const updateQuantity = useCallback(
        async (itemId: string, quantity: number, inventoryQantity: number) => {
            if (quantity < inventoryQantity) {
                // Optionally, you can throw an error or notify the user here
                if (quantity <= 0) {
                    setCartState((prevCart) => prevCart.filter((item) => item.id !== itemId));
                    return;
                }

                setCartState((prevCart) =>
                    prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
                );
            }
        },
        [],
    );

    const updateDiscount = useCallback(
        (itemId: string, discount: number, mode?: 'percent' | 'amount') => {
            setCartState((prevCart) =>
                prevCart.map((item) =>
                    item.id === itemId
                        ? {
                              ...item,
                              discount: Math.min(discount, item.price * item.quantity),
                              discountMode: mode,
                          }
                        : item,
                ),
            );
        },
        [],
    );

    const clearCart = useCallback(() => {
        setCartState([]);
    }, []);

    const setCart = useCallback((items: CartItem[]) => {
        setCartState(items);
    }, []);

    const value = useMemo(
        () => ({
            cart,
            totalItems,
            totalPrice,
            totalDiscount,
            finalPrice,
            wholesaleMode,
            setWholesaleMode,
            addToCart,
            removeFromCart,
            updateQuantity,
            updateDiscount,
            clearCart,
            setCart,
        }),
        [
            cart,
            totalItems,
            totalPrice,
            totalDiscount,
            finalPrice,
            wholesaleMode,
            setWholesaleMode,
            addToCart,
            removeFromCart,
            updateQuantity,
            updateDiscount,
            clearCart,
            setCart,
        ],
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
};

export default CartContext;
