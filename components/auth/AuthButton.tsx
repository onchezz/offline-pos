import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}

export function AuthButton({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
}: AuthButtonProps) {
    const baseClasses = 'rounded-lg py-4';
    const variantClasses =
        variant === 'primary' ? 'bg-gray-900' : 'bg-white border border-gray-300';
    const textClasses = variant === 'primary' ? 'text-white' : 'text-gray-900';
    const disabledClasses = disabled ? 'opacity-50' : '';

    return (
        <TouchableOpacity
            className={`${baseClasses} ${variantClasses} ${disabledClasses}`}
            onPress={onPress}
            disabled={disabled}>
            <Text className={`text-center font-semibold text-base ${textClasses}`}>{title}</Text>
        </TouchableOpacity>
    );
}
