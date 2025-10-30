import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';
import CategoryTab from './CategoryTab';

interface InventoryItem {
    id: string;
    name: string;
    category: string;
    brand: string;
    description: string;
    price: number;
    quantity: number;
    unit: string;
}

interface Props {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    inventoryItems: InventoryItem[];
}

const CategoryTabs = ({ selectedCategory, onCategoryChange, inventoryItems }: Props) => {
    const getCategoryCount = (category: string) => {
        if (category === 'All') return inventoryItems.length;
        return inventoryItems.filter((item) => item.category === category).length;
    };

    const categories = [
        { name: 'All', icon: 'apps', count: getCategoryCount('All') },
        { name: 'Beverages', icon: 'wine', count: getCategoryCount('Beverages') },
        { name: 'Snacks', icon: 'fast-food', count: getCategoryCount('Snacks') },
        { name: 'Dairy', icon: 'logo-dropbox', count: getCategoryCount('Dairy') },
        { name: 'Bakery', icon: 'bread', count: getCategoryCount('Bakery') },
        { name: 'Fruits', icon: 'apple', count: getCategoryCount('Fruits') },
        { name: 'Vegetables', icon: 'leaf', count: getCategoryCount('Vegetables') },
        { name: 'Meat', icon: 'restaurant', count: getCategoryCount('Meat') },
        { name: 'Frozen', icon: 'snow', count: getCategoryCount('Frozen') },
        { name: 'Household', icon: 'home', count: getCategoryCount('Household') },
        {
            name: 'Personal Care',
            icon: 'person',
            count: getCategoryCount('Personal Care'),
        },
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className='flex-row space-x-2'>
            {categories.map((category) => (
                <CategoryTab
                    key={category.name}
                    category={{
                        name: category.name,
                        icon: category.icon as ComponentProps<typeof Ionicons>['name'],
                        count: category.count,
                    }}
                    isSelected={selectedCategory === category.name}
                    onPress={() => onCategoryChange(category.name)}
                />
            ))}
        </ScrollView>
    );
};

export default CategoryTabs;
