import { useState } from 'react';

// imporove this

export const useSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleSearchFocus = () => setIsSearchFocused(true);
    const handleSearchBlur = () => setIsSearchFocused(false);

    return {
        searchQuery,
        setSearchQuery,
        isSearchFocused,
        handleSearchFocus,
        handleSearchBlur,
    };
};
