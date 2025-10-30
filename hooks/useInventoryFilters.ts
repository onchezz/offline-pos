import { FilterState, InventoryViewItem } from '@/types';
import { useMemo, useState } from 'react';

export const useInventoryFilters = (inventoryData: InventoryViewItem[]) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedFilter, setSelectedFilter] = useState<keyof FilterState>('All');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const filteredData = useMemo(() => {
        return inventoryData.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                selectedCategory === 'All' || item.category === selectedCategory;

            let matchesFilter = true;
            const isLowStock =
                typeof item.minStock === 'number' ? item.quantity <= item.minStock : false;
            const isOut = item.quantity === 0;
            const isOrdered = false; // no ordering metadata in InventoryViewItem
            if (selectedFilter === 'Low') {
                matchesFilter = isLowStock;
            } else if (selectedFilter === 'Out') {
                matchesFilter = isOut;
            } else if (selectedFilter === 'Ordered') {
                matchesFilter = isOrdered;
            }

            return matchesSearch && matchesCategory && matchesFilter;
        });
    }, [inventoryData, searchQuery, selectedCategory, selectedFilter]);

    const getFilterText = () => {
        const count = filteredData.length;
        if (selectedFilter === 'All') return `${count} items`;
        if (selectedFilter === 'Low') return `${count} items (Low Stock)`;
        if (selectedFilter === 'Out') return `${count} items (Out)`;
        if (selectedFilter === 'Ordered') return `${count} items (Ordered)`;
    };

    const toggleFilter = (filter: keyof FilterState) => {
        setSelectedFilter(selectedFilter === filter ? 'All' : filter);
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedFilter,
        toggleFilter,
        isSearchFocused,
        setIsSearchFocused,
        filteredData,
        getFilterText,
    };
};
