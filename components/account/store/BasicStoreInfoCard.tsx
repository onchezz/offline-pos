import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { StoreAvatar } from './StoreAvatar';

interface BasicStoreInfoCardProps {
    name: string;
    type: string;
    storeIcon?: string;
    isEditing: boolean;
    onNameChange: (text: string) => void;
    onTypeChange: (text: string) => void;
}

export const BasicStoreInfoCard: React.FC<BasicStoreInfoCardProps> = ({
    name,
    type,
    storeIcon,
    isEditing,
    onNameChange,
    onTypeChange,
}) => {
    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='items-center mb-4'>
                <StoreAvatar storeName={name} storeIcon={storeIcon} size='md' />
            </View>

            {/* Store Name */}
            <View className='mb-3'>
                <Text className='text-sm text-gray-600 font-medium mb-2'>Store Name</Text>
                {isEditing ? (
                    <TextInput
                        value={name}
                        onChangeText={onNameChange}
                        className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                    />
                ) : (
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900 font-semibold'>{name}</Text>
                    </View>
                )}
            </View>

            {/* Business Type */}
            <View>
                <Text className='text-sm text-gray-600 font-medium mb-2'>Business Type</Text>
                {isEditing ? (
                    <TextInput
                        value={type}
                        onChangeText={onTypeChange}
                        className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                    />
                ) : (
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900'>{type}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
