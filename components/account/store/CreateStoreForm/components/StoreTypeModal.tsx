import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { STORE_TYPES } from './constants';
import { ModalBase } from './ModalBase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const StoreTypeModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    value: string;
    onSelect: (value: string) => void;
    options: typeof STORE_TYPES;
}> = ({ visible, onClose, value, onSelect, options }) => {
    const itemWidth = (SCREEN_WIDTH - 64) / 4 - 6;

    return (
        <ModalBase visible={visible} onClose={onClose} title='Select Store Type'>
            <ScrollView className='px-4 py-3'>
                <View className='flex-row flex-wrap gap-2'>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option.label}
                            className={`border-2 rounded-lg justify-center items-center p-1 ${
                                value === option.label
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 bg-white'
                            }`}
                            style={{ width: itemWidth, aspectRatio: 1 }}
                            onPress={() => {
                                onSelect(option.label);
                                onClose();
                            }}>
                            <Text className='text-2xl mb-0.5'>{option.emoji}</Text>
                            <Text className='text-xs text-gray-700 text-center' numberOfLines={1}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ModalBase>
    );
};
