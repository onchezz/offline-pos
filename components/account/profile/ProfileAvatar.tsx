import React from 'react';
import { View, Text } from 'react-native';

interface ProfileAvatarProps {
    initials: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ initials, size = 'md' }) => {
    const sizeConfig = {
        sm: 'w-12 h-12 text-lg',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-24 h-24 text-4xl',
    };

    return (
        <View
            className={`${sizeConfig[size]} rounded-full bg-gray-200 items-center justify-center`}>
            <Text className={`${sizeConfig[size].split(' ')[2]} font-semibold text-gray-700`}>
                {initials}
            </Text>
        </View>
    );
};
