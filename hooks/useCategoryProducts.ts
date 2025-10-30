import { FilterState, InventoryViewItem } from '@/types';
import { useMemo, useState } from 'react';

export const useCategoryProducts = (
    categoryName: string,
    allInventoryData: InventoryViewItem[],
) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<keyof FilterState>('All');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    // Filter products by category. If categoryName is 'All' (case-insensitive) or empty,
    // return the entire inventory dataset.
    const categoryProducts = useMemo(() => {
        if (!categoryName || categoryName.toLowerCase() === 'all') {
            return allInventoryData;
        }
        return allInventoryData.filter((item) => item.category === categoryName);
    }, [allInventoryData, categoryName]);

    // Apply search and filters
    const filteredData = useMemo(() => {
        return categoryProducts.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

            const isLowStock =
                typeof item.minStock === 'number' ? item.quantity <= item.minStock : false;
            const isOut = item.quantity === 0;
            let matchesFilter = true;
            if (selectedFilter === 'Low') {
                matchesFilter = isLowStock;
            } else if (selectedFilter === 'Out') {
                matchesFilter = isOut;
            }

            return matchesSearch && matchesFilter;
        });
    }, [categoryProducts, searchQuery, selectedFilter]);

    // Calculate stats
    const stats = useMemo(
        () => ({
            lowStockItems: categoryProducts.filter((item) =>
                typeof item.minStock === 'number' ? item.quantity <= item.minStock : false,
            ).length,
            outOfStockItems: categoryProducts.filter((item) => item.quantity === 0).length,
            totalItems: categoryProducts.length,
        }),
        [categoryProducts],
    );

    const toggleFilter = (filter: keyof FilterState) => {
        setSelectedFilter(selectedFilter === filter ? 'All' : filter);
    };

    return {
        searchQuery,
        setSearchQuery,
        selectedFilter,
        toggleFilter,
        isSearchFocused,
        setIsSearchFocused,
        filteredData,
        stats,
    };
};
