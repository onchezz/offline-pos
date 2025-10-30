import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface InventoryHeaderProps {
    onShowModal: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({ onShowModal }) => {
    return (
        <View className='flex-row items-center justify-between mb-4'>
            <View className='flex-row items-center'>
                <View className='w-8 h-8 bg-black rounded-lg items-center justify-center mr-3'>
                    <Feather name='package' size={16} color='white' />
                </View>
                <Text className='text-xl font-bold text-gray-900'>Inventory</Text>
            </View>
            <TouchableOpacity
                className='bg-black px-3 py-2 rounded-lg flex-row items-center'
                onPress={onShowModal}>
                <Feather name='plus' size={14} color='white' />
                <Text className='text-white font-medium ml-1'>Add Item</Text>
            </TouchableOpacity>
        </View>
    );
};
