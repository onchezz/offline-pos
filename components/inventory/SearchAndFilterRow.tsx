import React from 'react';
import { View } from 'react-native';
import { InventorySearchBar } from './InventorySearchBar';
import { FilterButton } from './FilterButton';
import { FilterState } from '@/types';

interface SearchAndFilterRowProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isSearchFocused: boolean;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
    onClear: () => void;
    selectedFilter: keyof FilterState;
    onToggleFilter: (filter: keyof FilterState) => void;
}

export const SearchAndFilterRow: React.FC<SearchAndFilterRowProps> = ({
    searchQuery,
    onSearchChange,
    isSearchFocused,
    onSearchFocus,
    onSearchBlur,
    onClear,
    selectedFilter,
    onToggleFilter,
}) => {
    return (
        <View className='flex-row items-center mb-4'>
            <InventorySearchBar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                isSearchFocused={isSearchFocused}
                onSearchFocus={onSearchFocus}
                onSearchBlur={onSearchBlur}
                onClear={onClear}
            />

            {!isSearchFocused && searchQuery.length === 0 && (
                <>
                    <FilterButton
                        type='Low'
                        isActive={selectedFilter === 'Low'}
                        onPress={() => onToggleFilter('Low')}
                    />
                    <FilterButton
                        type='Out'
                        isActive={selectedFilter === 'Out'}
                        onPress={() => onToggleFilter('Out')}
                    />
                    <FilterButton
                        type='Ordered'
                        isActive={selectedFilter === 'Ordered'}
                        onPress={() => onToggleFilter('Ordered')}
                    />
                </>
            )}
        </View>
    );
};
