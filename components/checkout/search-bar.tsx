import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInput, View } from 'react-native';

interface SearchBarProps {
    isSearchFocused: boolean;
    setIsSearchFocused: (focused: boolean) => void;
    shadowOffsetHeight: number;
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
    placeHolderText: string;
    value: string;
    onChangeText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
    isSearchFocused,
    setIsSearchFocused,
    shadowOffsetHeight,
    shadowOpacity,
    shadowRadius,
    elevation,
    placeHolderText,
    value,
    onChangeText,
}) => {
    return (
        <View
            className={`flex-row items-center  ${
                isSearchFocused ? ' bg-gray-200' : 'bg-gray-300'
            } rounded-xl px-1 py-1 mb-2 ${
                isSearchFocused ? 'border border-gray-200' : 'border border-transparent'
            }`}
            style={{
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: shadowOffsetHeight,
                },
                shadowOpacity: shadowOpacity,
                shadowRadius: shadowRadius,
                elevation: elevation,
            }}>
            <Search size={20} color='#9CA3AF' />
            <TextInput
                className='flex-1 ml-1 text-gray-700'
                placeholderTextColor='#9CA3AF'
                placeholder={placeHolderText}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
            />
        </View>
    );
};

export default SearchBar;
