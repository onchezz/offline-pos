import React from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ModalBase } from './ModalBase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const EmojiPickerModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    value: string;
    onSelect: (value: string) => void;
    suggestedEmojis: string[];
    allEmojis: string[];
}> = ({ visible, onClose, value, onSelect, suggestedEmojis, allEmojis }) => {
    const suggestedWidth = (SCREEN_WIDTH - 64) / 6 - 7;
    const allWidth = (SCREEN_WIDTH - 80) / 8 - 4;

    return (
        <ModalBase visible={visible} onClose={onClose} title='Select Logo'>
            <ScrollView className='px-4 py-3'>
                <View className='mb-4'>
                    <Text className='text-xs text-gray-500 mb-2'>Suggested for your store</Text>
                    <View className='flex-row flex-wrap gap-2'>
                        {suggestedEmojis.map((emoji, index) => (
                            <TouchableOpacity
                                key={`${emoji}-${index}`}
                                className={`border-2 rounded-lg justify-center items-center ${
                                    value === emoji
                                        ? 'border-gray-900 bg-gray-50'
                                        : 'border-gray-200'
                                }`}
                                style={{ width: suggestedWidth, aspectRatio: 1 }}
                                onPress={() => {
                                    onSelect(emoji);
                                    onClose();
                                }}>
                                <Text className='text-2xl'>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View>
                    <Text className='text-xs text-gray-500 mb-2'>All emojis</Text>
                    <View className='flex-row flex-wrap gap-1 border border-gray-100 rounded-lg p-1'>
                        {allEmojis.map((emoji, index) => (
                            <TouchableOpacity
                                key={`${emoji}-${index}`}
                                className={`rounded justify-center items-center ${
                                    value === emoji ? 'bg-gray-100' : ''
                                }`}
                                style={{ width: allWidth, aspectRatio: 1 }}
                                onPress={() => {
                                    onSelect(emoji);
                                    onClose();
                                }}>
                                <Text className='text-xl'>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </ModalBase>
    );
};
