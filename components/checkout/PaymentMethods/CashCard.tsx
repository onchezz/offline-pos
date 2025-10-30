import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    selected: boolean;
    cashValue: number;
    cashAmount: string;
    isPartialCash: boolean;
    remainingAmount: number;
    showPartialOptions: boolean;
    onSelect: () => void;
    onChangeAmount: (v: string) => void;
    onShowPartialOptions: () => void;
    onChoosePartialMpesa: () => void;
    onChoosePartialStoreCredit: () => void;
};

export const CashCard: React.FC<Props> = ({
    selected,
    cashValue,
    cashAmount,
    isPartialCash,
    remainingAmount,
    showPartialOptions,
    onSelect,
    onChangeAmount,
    onShowPartialOptions,
    onChoosePartialMpesa,
    onChoosePartialStoreCredit,
}) => {
    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`rounded-xl p-2 mb-2 border ${
                selected ? 'bg-orange-50 border-orange-500' : 'bg-white border-gray-200'
            }`}>
            <View className='flex-row items-center'>
                <View className='w-8 h-8 bg-orange-500 rounded-lg items-center justify-center mr-3'>
                    <Ionicons name='cash-outline' size={20} color='#fff' />
                </View>
                <View className='flex-1'>
                    <Text className='text-lg font-semibold text-gray-900'>Cash</Text>
                    <Text className='text-sm text-gray-500'>Cash payment</Text>
                </View>
                {cashValue > 0 && !selected && (
                    <View className='bg-orange-500 px-3 py-1 rounded-lg'>
                        <Text className='text-white font-semibold'>${cashValue.toFixed(2)}</Text>
                    </View>
                )}
            </View>

            {selected && (
                <View className='mt-2'>
                    <Text className='text-sm font-medium text-gray-700 mb-2'>Amount to pay</Text>
                    <View className='flex-row items-center border border-gray-300 rounded-lg px-2 bg-gray-50 '>
                        <Text className='text-gray-600'>$</Text>
                        <TextInput
                            className='text-base'
                            placeholder='0.00'
                            value={cashAmount}
                            onChangeText={onChangeAmount}
                            keyboardType='decimal-pad'
                        />
                    </View>

                    {isPartialCash && !showPartialOptions && (
                        <TouchableOpacity
                            onPress={onShowPartialOptions}
                            className='bg-blue-500 rounded-lg py-3 mb-3'>
                            <Text className='text-white text-center font-semibold'>
                                Partial Payments (${remainingAmount.toFixed(2)} remaining)
                            </Text>
                        </TouchableOpacity>
                    )}

                    {showPartialOptions && (
                        <View className='bg-gray-100 rounded-lg p-3 mb-3'>
                            <Text className='text-sm font-medium text-gray-700 mb-2'>
                                Pay remaining ${remainingAmount.toFixed(2)} with:
                            </Text>
                            <View className='flex-row gap-2'>
                                <TouchableOpacity
                                    onPress={onChoosePartialMpesa}
                                    className='flex-1 bg-green-500 rounded-lg py-3'>
                                    <Text className='text-white text-center font-medium'>
                                        M-Pesa
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={onChoosePartialStoreCredit}
                                    className='flex-1 bg-blue-500 rounded-lg py-3'>
                                    <Text className='text-white text-center font-medium'>
                                        Store Credit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};
