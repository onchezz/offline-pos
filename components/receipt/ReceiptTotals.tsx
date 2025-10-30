import React from 'react';
import { Text, View } from 'react-native';

interface Props {
    subtotal: number;
    totalDiscount?: number;
    total: number;
    currencySymbol?: string;
}

const ReceiptTotals: React.FC<Props> = ({ subtotal, totalDiscount = 0, total, currencySymbol }) => {
    const formatCurrency = (n: number) => {
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: `${currencySymbol || 'KES'}`,
            }).format(n);
        } catch {
            return `$${n.toFixed(2)}`;
        }
    };

    return (
        <View className='mt-2'>
            <View className='flex-row justify-between items-center'>
                <Text className='text-sm text-gray-600'>Subtotal:</Text>
                <Text className='text-sm text-gray-900'>{formatCurrency(subtotal)}</Text>
            </View>

            {totalDiscount > 0 && (
                <View className='flex-row justify-between items-center mt-2'>
                    <Text className='text-xs text-green-600'>Total Discount</Text>
                    <Text className='text-xs text-green-600'>-{formatCurrency(totalDiscount)}</Text>
                </View>
            )}

            <View className='flex-row justify-between items-center mt-3'>
                <Text className='text-base font-bold text-gray-900'>TOTAL:</Text>
                <Text className='text-base font-bold text-gray-900'>{formatCurrency(total)}</Text>
            </View>
        </View>
    );
};

export default ReceiptTotals;
