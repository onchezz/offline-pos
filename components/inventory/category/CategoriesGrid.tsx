import React from 'react';
import { View } from 'react-native';
import { CategoryChip } from './CategoryChip';
import { Category } from '@/types';

interface CategoriesGridProps {
    categories: Category[];
    selectedCategory: string;
    onCategoryPress: (category: Category) => void;
}

export const CategoriesGrid: React.FC<CategoriesGridProps> = ({
    categories,
    selectedCategory,
    onCategoryPress,
}) => {
    return (
        <View className='flex-row flex-wrap'>
            {categories.map((category) => (
                <CategoryChip
                    key={category.name}
                    category={category}
                    isSelected={selectedCategory === category.name}
                    onPress={() => onCategoryPress(category)}
                />
            ))}
        </View>
    );
};
