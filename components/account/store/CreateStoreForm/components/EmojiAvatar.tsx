import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const EmojiAvatarButton: React.FC<{
    emoji: string;
    onPress: () => void;
}> = ({ emoji, onPress }) => (
    <View className='relative'>
        <View className='w-12 h-12 rounded-full bg-gray-100 justify-center items-center'>
            <Text className='text-2xl'>{emoji}</Text>
        </View>
        <TouchableOpacity
            className='absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-gray-900 justify-center items-center'
            onPress={onPress}>
            <Text className='text-xs'>✏️</Text>
        </TouchableOpacity>
    </View>
);
