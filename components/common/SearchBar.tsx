import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
    placeholder?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    isSearchFocused?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder = 'Search products...',
    onFocus,
    onBlur,
    isSearchFocused = false,
    value,
    onChangeText,
}) => {
    return (
        <View
            className={`flex-row items-center bg-gray-100 rounded-lg px-4 mx-1   ${
                isSearchFocused ? 'border border-gray-400' : 'border border-transparent'
            }`}
            style={{
                shadowColor: '#D6D5D3',
                shadowOffset: {
                    width: 0,
                    height: isSearchFocused ? 2 : 1,
                },
                shadowOpacity: isSearchFocused ? 0.1 : 0.05,
                shadowRadius: isSearchFocused ? 4 : 2,
                elevation: isSearchFocused ? 3 : 1,
            }}>
            <Search size={15} color='#9CA3AF' />
            <TextInput
                placeholder={placeholder}
                className='flex-1 ml-1 text-gray-700'
                placeholderTextColor='#9CA3AF'
                onFocus={onFocus}
                onBlur={onBlur}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};
