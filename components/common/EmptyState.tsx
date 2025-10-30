import React from 'react';
import { View, Text } from 'react-native';

interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    className = 'flex-1 items-center justify-center py-20',
}) => {
    return (
        <View className={className}>
            <Text className='text-6xl mb-4'>{icon}</Text>
            <Text className='text-gray-500 text-lg font-medium mb-2'>{title}</Text>
            <Text className='text-gray-400 text-center'>{description}</Text>
        </View>
    );
};
