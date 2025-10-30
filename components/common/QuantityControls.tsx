import React from 'react';
import { Text, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { ActionButton } from '../ui/ActionButton';

export const QuantityControls: React.FC<{
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary';
}> = ({ quantity, onIncrease, onDecrease, size = 'sm', variant = 'primary' }) => {
    const textSizeClass = {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    }[size];

    const quantityWidthClass = {
        xs: 'w-8',
        sm: 'w-10',
        md: 'w-12',
        lg: 'w-16',
    }[size];

    const heightClass = {
        xs: 'h-6',
        sm: 'h-8',
        md: 'h-10',
        lg: 'h-12',
    }[size];

    // Border radius based on size - more subtle rounding
    const borderRadiusClass = {
        xs: 'rounded-md', // 6px
        sm: 'rounded-lg', // 8px
        md: 'rounded-xl', // 12px
        lg: 'rounded-2xl', // 16px
    }[size];

    // Background colors for the middle section based on variant
    const quantityBgClass = variant === 'primary' ? 'bg-gray-900' : 'bg-white';
    const quantityTextClass = variant === 'primary' ? 'text-white' : 'text-gray-700';

    return (
        <View className={`flex-row items-center ${borderRadiusClass} overflow-hidden`}>
            {/* Decrease Button - Left side rounded */}
            <ActionButton
                icon={Minus}
                iconPosition='only'
                onPress={onDecrease}
                variant={variant}
                size={size}
                shape='rectangle'
                disabled={quantity <= 0}
                className='rounded-none' // Remove all rounding, let container handle it
            />

            {/* Quantity Display - Middle section */}
            <View
                className={`${heightClass} ${quantityWidthClass} ${quantityBgClass} items-center justify-center`}
                style={{
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: '#696a6bff', // gray-200
                }}>
                <Text className={`${textSizeClass} font-medium ${quantityTextClass}`}>
                    {quantity}
                </Text>
            </View>

            {/* Increase Button - Right side rounded */}
            <ActionButton
                icon={Plus}
                iconPosition='only'
                onPress={onIncrease}
                variant={variant}
                size={size}
                shape='rectangle'
                className='rounded-none'
            />
        </View>
    );
};
