import CategoryCard from '@/components/checkout/category/CategoryCard';
import { Category } from '@/types';
import React from 'react';
import { View } from 'react-native';
import { SectionTitle } from '../common/SectionTitle';

interface CategoriesGridProps {
    categories: Category[];
    onCategoryPress: (category: Category) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({ categories, onCategoryPress }) => {
    return (
        <View className='px-4'>
            <SectionTitle title='Categories' />
            <View className='flex-row flex-wrap justify-between'>
                {categories.map((category: Category, index: number) => (
                    <CategoryCard key={index} category={category} onPress={onCategoryPress} />
                ))}
            </View>
        </View>
    );
};
