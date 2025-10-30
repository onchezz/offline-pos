import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { BackButton } from './BackButton';

interface HeaderProps {
    title: string;
    children?: React.ReactNode;
    showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, children, showBackButton }) => {
    function toTitleCase(str: string): string {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    return (
        <View className='px-2 pt-2 pb-2'>
            <View className='  flex-row items-center'>
                {showBackButton ? (
                    <BackButton onPress={() => router.back()} className='mr-4' />
                ) : (
                    <></>
                )}
                <Text className='text-xl font-bold text-gray-900 mb-2 ml-4'>
                    {toTitleCase(title)}
                </Text>
            </View>

            {children}
        </View>
    );
};
