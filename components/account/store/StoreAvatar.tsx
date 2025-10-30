import React from 'react';
import { Text, View } from 'react-native';

interface StoreAvatarProps {
    storeName: string;
    storeIcon?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const StoreAvatar: React.FC<StoreAvatarProps> = ({ storeName, storeIcon, size = 'md' }) => {
    const sizeConfig = {
        sm: 'w-12 h-12 text-lg',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-24 h-24 text-4xl',
    };

    const storeInitials =
        storeName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'AD';

    return (
        <View
            className={`${sizeConfig[size]} rounded-full bg-gray-200 items-center justify-center`}>
            {storeIcon ? (
                <Text className={`${sizeConfig[size].split(' ')[2]} font-semibold text-gray-700`}>
                    {storeIcon}
                </Text>
            ) : (
                <Text className={`${sizeConfig[size].split(' ')[2]} font-semibold text-gray-700`}>
                    {storeInitials}
                </Text>
            )}
        </View>
    );
};
