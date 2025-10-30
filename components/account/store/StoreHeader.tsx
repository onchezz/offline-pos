import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StoreHeaderProps {
    isEditing: boolean;
    onBack: () => void;
    onEdit: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ isEditing, onBack, onEdit }) => {
    return (
        <View className='bg-white px-4 py-3 flex-row justify-between items-center'>
            <View className='flex-row items-center'>
                <TouchableOpacity onPress={onBack} className='mr-3'>
                    <Ionicons name='arrow-back' size={24} color='#000' />
                </TouchableOpacity>
                <Ionicons name='storefront-outline' size={24} color='#000' />
                <Text className='ml-2 text-lg font-semibold'>Store Information</Text>
            </View>
            {!isEditing && (
                <TouchableOpacity
                    onPress={onEdit}
                    className='flex-row items-center bg-gray-900 rounded-lg px-4 py-2'>
                    <Ionicons name='create-outline' size={16} color='#FFFFFF' />
                    <Text className='ml-2 text-sm text-white font-medium'>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
