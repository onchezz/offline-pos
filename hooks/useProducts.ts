import { CartItem, Product } from '@/types';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useProducts = (
    categoryName: string,
    existingCart: CartItem[] = [],
    inventoryData: Product[],
    onCartUpdate?: (cartItems: CartItem[]) => void,
) => {
    // Initialize products with existing cart quantities
    const initializeProductsWithCart = useCallback(
        (products: Product[], cart: CartItem[]): Product[] => {
            return products.map((product) => {
                const cartItem = cart.find((item) => item.id === product.id);
                return {
                    ...product,
                    inCart: cartItem ? cartItem.quantity : 0,
                };
            });
        },
        [],
    );

    const categoryProducts = useMemo(
        () => inventoryData.filter((product) => product.category === categoryName),
        [categoryName, inventoryData],
    );

    const [productList, setProductList] = useState<Product[]>(() =>
        initializeProductsWithCart(categoryProducts, existingCart),
    );

    // Keep internal productList in sync when inventory/category or existingCart change.
    // This ensures the UI reloads products when the selected category or inventory data updates.
    useEffect(() => {
        setProductList(initializeProductsWithCart(categoryProducts, existingCart));
    }, [categoryProducts, existingCart, initializeProductsWithCart]);

    const updateProductQuantity = useCallback(
        (productId: string, newQuantity: number) => {
            setProductList((prev) => {
                const updatedProducts = prev.map((product) =>
                    product.id === productId
                        ? { ...product, inCart: Math.max(0, newQuantity) }
                        : product,
                );

                // Update global cart when local cart changes
                if (onCartUpdate) {
                    const cartItems: CartItem[] = updatedProducts
                        .filter((p) => (p.inCart || 0) > 0)
                        .map((p) => {
                            const cartProduct: CartItem = {
                                id: p.id,
                                name: p.name,
                                price: p.price,
                                quantity: p.inCart || 0,
                                inventory: p.quantity || 0,
                            };
                            return cartProduct;
                        });
                    onCartUpdate(cartItems);
                }

                return updatedProducts;
            });
        },
        [onCartUpdate],
    );

    const addToCart = useCallback(
        (product: Product) => {
            updateProductQuantity(product.id, (product.inCart || 0) + 1);
        },
        [updateProductQuantity],
    );

    const removeFromCart = useCallback(
        (product: Product) => {
            updateProductQuantity(product.id, (product.inCart || 0) - 1);
        },
        [updateProductQuantity],
    );

    const filteredProducts = useMemo(
        () => (searchQuery: string) =>
            productList.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [productList],
    );

    const cartTotals = useMemo(() => {
        const totalItems = productList.reduce((sum, product) => sum + (product.inCart || 0), 0);
        const totalPrice = productList.reduce(
            (sum, product) => sum + product.price * (product.inCart || 0),
            0,
        );
        return { totalItems, totalPrice };
    }, [productList]);

    const getCartItems = useCallback(
        () => productList.filter((p) => (p.inCart || 0) > 0),
        [productList],
    );

    return {
        productList,
        addToCart,
        removeFromCart,
        filteredProducts,
        cartTotals,
        getCartItems,
    };
};
