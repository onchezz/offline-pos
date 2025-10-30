import { SearchBar } from '@/components/common/SearchBar';
import React from 'react';
import { Text, View } from 'react-native';
import { CreditRatingFilter } from './CreditRatingFilter';

interface CreditSummarySectionProps {
    totalAmount: number;
    showCreditRating: boolean;
    onCloseCreditRating: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const CreditSummarySection: React.FC<CreditSummarySectionProps> = ({
    totalAmount,
    showCreditRating,
    onCloseCreditRating,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <View className='p-4  border-gray-200'>
            <View className='flex-row justify-between items-center mb-3'>
                <Text className='text-lg font-semibold'>Credit</Text>
                <Text className='text-base text-gray-600'>
                    Total Amount: <Text className='font-semibold'>${totalAmount.toFixed(2)}</Text>
                </Text>
            </View>

            {showCreditRating && <CreditRatingFilter onClose={onCloseCreditRating} />}

            <SearchBar
                placeholder='Search customers...'
                value={searchQuery}
                onChangeText={onSearchChange}
            />
        </View>
    );
};
