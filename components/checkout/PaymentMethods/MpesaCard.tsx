import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    selected: boolean;
    mpesaValue: number;
    mpesaAmount: string;
    mpesaPhone: string;
    isPartialMpesa: boolean;
    remainingAmount: number;
    showPartialOptions: boolean;
    onSelect: () => void;
    onChangeAmount: (v: string) => void;
    onChangePhone: (v: string) => void;
    onShowPartialOptions: () => void;
    onChoosePartialCash: () => void;
    onChoosePartialStoreCredit: () => void;
};

export const MpesaCard: React.FC<Props> = ({
    selected,
    mpesaValue,
    mpesaAmount,
    mpesaPhone,
    isPartialMpesa,
    remainingAmount,
    showPartialOptions,
    onSelect,
    onChangeAmount,
    onChangePhone,
    onShowPartialOptions,
    onChoosePartialCash,
    onChoosePartialStoreCredit,
}) => {
    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`rounded-xl p-2 mb-1 border ${
                selected ? 'bg-green-50 border-green-500' : 'bg-white border-gray-200'
            }`}>
            <View className='flex-row items-center'>
                <View className='w-8 h-8 bg-green-500 rounded-lg items-center justify-center mr-3'>
                    <Ionicons name='phone-portrait-outline' size={20} color='#fff' />
                </View>
                <View className='flex-1'>
                    <Text className='text-lg font-semibold text-gray-900'>M-Pesa</Text>
                    <Text className='text-sm text-gray-500'>Pay with mobile money</Text>
                </View>
                {mpesaValue > 0 && !selected && (
                    <View className='bg-green-500 px-3 py-1 rounded-lg'>
                        <Text className='text-white font-semibold'>${mpesaValue.toFixed(2)}</Text>
                    </View>
                )}
            </View>

            {selected && (
                <View className='mt-4'>
                    <Text className='text-sm font-medium text-gray-700 mb-2'>Amount to pay</Text>
                    <View className='flex-row items-center border border-gray-300 px-2 rounded-lg  bg-gray-50 mb-2'>
                        <Text className='text-gray-600 mr-4'>$</Text>

                        <TextInput
                            className=' text-base'
                            placeholder='0.00'
                            value={mpesaAmount}
                            onChangeText={onChangeAmount}
                            keyboardType='decimal-pad'
                        />
                    </View>
                    <Text className='text-sm font-medium text-gray-700 mb-2'>Phone number</Text>
                    <View className='border border-gray-300 rounded-lg px-2  bg-gray-50 mb-2'>
                        <TextInput
                            className='text-base'
                            placeholder='Phone number (07XX XXX XXX)'
                            value={mpesaPhone}
                            onChangeText={onChangePhone}
                            keyboardType='phone-pad'
                        />
                    </View>
                    {isPartialMpesa && !showPartialOptions && (
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
                                    onPress={onChoosePartialCash}
                                    className='flex-1 bg-orange-500 rounded-lg py-3'>
                                    <Text className='text-white text-center font-medium'>Cash</Text>
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
