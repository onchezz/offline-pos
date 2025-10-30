import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CategoryTabProps {
    name: string;
    icon: ComponentProps<typeof Ionicons>['name'];
    count: number;
}

interface Props {
    category: CategoryTabProps;
    isSelected: boolean;
    onPress: () => void;
}

const CategoryTab = ({ category, isSelected, onPress }: Props) => {
    return (
        <TouchableOpacity
            className={`flex-row items-center px-4 py-2 rounded-full ${
                isSelected ? 'bg-black' : 'bg-gray-100'
            } ml-2`}
            onPress={onPress}>
            <Ionicons name={category.icon} size={16} color={isSelected ? 'white' : '#666'} />
            <Text className={`ml-2 font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                {category.name}
            </Text>
            <View
                className={`ml-2 px-2 py-1 rounded-full ${
                    isSelected ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                <Text
                    className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                    {category.count}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default CategoryTab;
