import React from 'react';
import { Text } from 'react-native';

interface SectionTitleProps {
    title: string;
    className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
    title,
    className = 'text-lg font-semibold text-gray-900 mb-3',
}) => {
    return <Text className={className}>{title}</Text>;
};
