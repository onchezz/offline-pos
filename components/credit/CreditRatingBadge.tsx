import { RatingType } from '@/types';
import React from 'react';
import { Text, View } from 'react-native';

interface CreditRatingBadgeProps {
    rating: RatingType;
    size?: 'sm' | 'md';
}

export const CreditRatingBadge: React.FC<CreditRatingBadgeProps> = ({ rating, size = 'sm' }) => {
    const getRatingStyles = () => {
        switch (rating) {
            case 'Low':
                return 'bg-red-100 text-red-600';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-600';
            case 'Good':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

    return (
        <View className={`rounded-lg ${getRatingStyles()} ${sizeClass}`}>
            <Text className={`font-light text-sm ${getRatingStyles()}`}>{rating}</Text>
        </View>
    );
};
