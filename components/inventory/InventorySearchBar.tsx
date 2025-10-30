import { Feather } from '@expo/vector-icons';
import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

interface InventorySearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isSearchFocused: boolean;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
    onClear: () => void;
}

export const InventorySearchBar: React.FC<InventorySearchBarProps> = ({
    searchQuery,
    onSearchChange,
    isSearchFocused,
    onSearchFocus,
    onSearchBlur,
    onClear,
}) => {
    return (
        <View
            className={
                isSearchFocused || searchQuery.length > 0
                    ? 'flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2'
                    : 'flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mr-2'
            }>
            <Feather name='search' size={16} color='#9CA3AF' />
            <TextInput
                className='flex-1 ml-2 text-gray-900'
                placeholder='Search'
                placeholderTextColor='#9CA3AF'
                value={searchQuery}
                onChangeText={onSearchChange}
                onFocus={onSearchFocus}
                onBlur={onSearchBlur}
            />
            {isSearchFocused && (
                <TouchableOpacity onPress={onClear}>
                    <Feather name='x' size={16} color='#9CA3AF' />
                </TouchableOpacity>
            )}
        </View>
    );
};
