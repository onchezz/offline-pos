import { BackButton } from '@/components/common/BackButton';
import { Category } from '@/types';
import React from 'react';
import { Text, View } from 'react-native';

interface CategoryHeaderProps {
    category: Category;
    onBack: () => void;
    productCount?: number;
    children?: React.ReactNode;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({
    category,
    productCount,
    onBack,
    children,
}) => {
    return (
        <View className='bg-white px-4 pt-4 pb-2'>
            <View className='flex-row items-center mb-4'>
                <BackButton onPress={onBack} />
                <View className='flex-1'>
                    <View className='flex-row items-center'>
                        <Text className='text-xl font-bold text-gray-900 mr-2'>
                            {category.icon} {category.name}
                        </Text>
                    </View>
                    <Text className='text-sm text-gray-500 mt-1'>
                        {productCount} products available
                    </Text>
                </View>
            </View>
            {children}
        </View>
    );
};
