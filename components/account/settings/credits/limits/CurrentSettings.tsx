import React from 'react';
import { Text, View } from 'react-native';
import { SummaryCard } from './SummaryCard';

interface CurrentSettingsSummaryProps {
    maxPerCustomer: string;
    maxPerTransaction: string;
    creditDays: string;
}

export const CurrentSettingsSummary: React.FC<CurrentSettingsSummaryProps> = ({
    maxPerCustomer,
    maxPerTransaction,
    creditDays,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <Text className='text-base font-semibold mb-4'>Current Settings Summary</Text>

            <SummaryCard value={maxPerCustomer} label='Max Per Customer' isCurrency />

            <SummaryCard
                value={maxPerTransaction}
                label='Max Per Transaction'
                color='blue'
                isCurrency
            />

            <SummaryCard value={creditDays} label='Credit Days' color='green' />
        </View>
    );
};
