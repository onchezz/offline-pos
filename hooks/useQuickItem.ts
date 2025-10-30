import { CartItem, QuickItem } from '@/types';
import { useCallback, useMemo } from 'react';

export const useQuickItem = (
    item: QuickItem,
    globalCart: CartItem[],
    setGlobalCart: (cart: CartItem[]) => void,
) => {
    // Extract price from string format
    const itemPrice = useMemo(() => parseFloat(item.price.replace('$', '')), [item.price]); // - needs to be more dynamic

    // Generate consistent ID for this quick item
    const itemId = useMemo(
        () => `quick-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
        [item.name],
    );

    // Find current quantity in cart
    const currentCartItem = useMemo(
        () => globalCart.find((cartItem) => cartItem.id === itemId),
        [globalCart, itemId],
    );

    const currentQuantity = currentCartItem?.quantity || 0;

    // Create cart item structure
    const createCartItem = useCallback(
        (quantity: number): CartItem => ({
            id: itemId,
            name: item.name,
            price: itemPrice,
            quantity,
            inventory: 0,
        }),
        [itemId, item.name, itemPrice],
    );

    // Add item to cart
    const addToCart = useCallback(() => {
        if (currentCartItem) {
            // Update existing item quantity
            const updatedCart = globalCart.map((cartItem) =>
                cartItem.id === itemId
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem,
            );
            setGlobalCart(updatedCart);
        } else {
            // Add new item to cart
            const newCartItem = createCartItem(1);
            setGlobalCart([...globalCart, newCartItem]);
        }
    }, [currentCartItem, globalCart, itemId, createCartItem, setGlobalCart]);

    // Remove item from cart or decrease quantity
    const removeFromCart = useCallback(() => {
        if (currentCartItem) {
            if (currentCartItem.quantity > 1) {
                // Decrease quantity
                const updatedCart = globalCart.map((cartItem) =>
                    cartItem.id === itemId
                        ? { ...cartItem, quantity: cartItem.quantity - 1 }
                        : cartItem,
                );
                setGlobalCart(updatedCart);
            } else {
                // Remove item completely
                const updatedCart = globalCart.filter((cartItem) => cartItem.id !== itemId);
                setGlobalCart(updatedCart);
            }
        }
    }, [currentCartItem, globalCart, itemId, setGlobalCart]);

    return {
        currentQuantity,
        addToCart,
        removeFromCart,
        itemPrice,
    };
};
