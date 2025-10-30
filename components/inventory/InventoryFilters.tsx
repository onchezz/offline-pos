import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    searchQuery: string;
    onSearchChange: (text: string) => void;
}

const InventoryFilters = ({ searchQuery, onSearchChange }: Props) => {
    return (
        <View className='flex-col space-x-3'>
            <View className='flex-1 bg-gray-100 rounded-xl px-4 py-3 flex-row items-center'>
                <Ionicons name='search' size={20} color='#666' />
                <TextInput
                    className='flex-1 ml-2 text-gray-700'
                    placeholder='Search inventory'
                    value={searchQuery}
                    onChangeText={onSearchChange}
                    placeholderTextColor='#999'
                />
                <TouchableOpacity className='mx-2'>
                    <Ionicons name='options-outline' size={20} color='#666' />
                </TouchableOpacity>
            </View>
            <View className='flex-row space-x-3 my-2'>
                <TouchableOpacity className='mx-2 bg-gray-100 rounded-xl px-4 py-3 flex-row items-center'>
                    <Ionicons name='warning-outline' size={16} color='#f59e0b' />
                    <Text className='ml-2 text-gray-700 font-medium'>Low</Text>
                </TouchableOpacity>
                <TouchableOpacity className='mx-2 bg-gray-100 rounded-xl px-4 py-3 flex-row items-center'>
                    <Ionicons name='archive-outline' size={16} color='#666' />
                    <Text className='ml-2 text-gray-700 font-medium'>Out</Text>
                </TouchableOpacity>
                <TouchableOpacity className='mx-2 bg-gray-100 rounded-xl px-4 py-3 flex-row items-center'>
                    <Ionicons name='cart-outline' size={16} color='#666' />
                    <Text className='ml-2 text-gray-700 font-medium'>Ordered</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default InventoryFilters;
