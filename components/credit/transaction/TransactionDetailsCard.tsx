import { Receipt, ShoppingCart } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';

interface TransactionDetailsCardProps {
    amount: number;
    date: string;
    items: string[];
    payments?: ({
        id?: string;
        amount: number;
        method?: string;
        note?: string;
        paymentDate?: number;
    } | null)[];
}

export const TransactionDetailsCard: React.FC<TransactionDetailsCardProps> = ({
    amount,
    date,
    items,
    payments = [],
}) => {
    const isCredit = amount < 0;

    return (
        <View className='mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm'>
            <View className='flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200'>
                <View className='flex-row items-center'>
                    <Receipt size={20} color='#000' />
                    <Text className='text-base font-semibold ml-2'>
                        {isCredit ? 'Credit' : 'Payment'}
                    </Text>
                </View>
                <Text
                    className={`text-2xl font-bold ${isCredit ? 'text-red-600' : 'text-green-600'}`}>
                    {isCredit ? '-' : '+'}${Math.abs(amount).toFixed(2)}
                </Text>
            </View>

            <View className='flex-row items-center justify-between mb-4'>
                <Text className='text-sm text-gray-600 mb-1'>Date:</Text>
                <Text className='text-base font-medium'>{date}</Text>
            </View>

            {items.length > 0 && (
                <View>
                    <View className='flex-row items-center mb-3'>
                        <ShoppingCart size={18} color='#000' />
                        <Text className='text-base font-semibold ml-2'>Items Purchased</Text>
                    </View>
                    {items.map((item, index) => (
                        <View key={index} className='bg-red-50 rounded-lg px-4 py-3 mb-2'>
                            <Text className='text-base text-gray-800'>{item}</Text>
                        </View>
                    ))}
                </View>
            )}

            {payments.length > 0 && (
                <View className='mt-4'>
                    <View className='flex-row items-center mb-3'>
                        <Receipt size={18} color='#000' />
                        <Text className='text-base font-semibold ml-2'>Payments</Text>
                    </View>
                    {payments.map((p, i) => {
                        if (!p) return null;
                        return (
                            <View key={p.id || i} className='bg-green-50 rounded-lg px-4 py-3 mb-2'>
                                <Text className='text-sm text-gray-600'>
                                    {`${p.method ? p.method.toUpperCase() : 'UNKNOWN'} — $${p.amount.toFixed(
                                        2,
                                    )}`}
                                </Text>
                                {p.note ? (
                                    <Text className='text-sm text-gray-500 mt-1'>{p.note}</Text>
                                ) : null}
                                {p.paymentDate ? (
                                    <Text className='text-xs text-gray-400 mt-1'>
                                        {new Date(p.paymentDate).toLocaleString()}
                                    </Text>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};
