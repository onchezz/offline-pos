import ProductCard from '@/components/checkout/ProductCard';
import { Category, Product } from '@/types';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { EmptyState } from '../common/EmptyState';

// we may neeed a products directory - or maybe not

interface ProductListProps {
    storeCurrency: string;
    products: Product[];
    category: Category;
    searchQuery: string;
    onAddToCart: (product: Product) => void;
    onRemoveFromCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
    products,
    category,
    searchQuery,
    onAddToCart,
    onRemoveFromCart,
}) => {
    const getEmptyStateMessage = () => {
        if (searchQuery) {
            return `No results for "${searchQuery}" in ${category.name}`;
        }
        return `${category.name} products will be added soon`;
    };

    return (
        <ScrollView className='flex-1 px-4 pt-2' showsVerticalScrollIndicator={false}>
            {products.length > 0 ? (
                products.map((product: Product) => (
                    <ProductCard
                        key={product.id}
                        storeCurrency=''
                        category={category}
                        product={product}
                        onAddToCart={onAddToCart}
                        onRemoveFromCart={onRemoveFromCart}
                    />
                ))
            ) : (
                <EmptyState
                    icon={category.icon}
                    title='No products found'
                    description={getEmptyStateMessage()}
                />
            )}

            {/* Bottom padding for cart bar */}
            <View className='h-24' />
        </ScrollView>
    );
};
