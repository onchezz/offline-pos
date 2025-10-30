import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Category } from '@/types';

interface CategoryChipProps {
    category: Category;
    isSelected: boolean;
    onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, isSelected, onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-row items-center px-3 py-2 mr-2 mb-2 rounded-full ${
                isSelected ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
            <Text className='text-sm mr-1'>{category.icon}</Text>
            <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {category.name}
            </Text>
            <Text className={`text-xs ml-1 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                {category.count}
            </Text>
        </TouchableOpacity>
    );
};
