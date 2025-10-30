import React from 'react';
import { Switch, Text, View } from 'react-native';
import { CustomInput, CustomLabel, Selector } from './BasicUIComponents';
import { STORE_TYPES } from './constants';
import { EmojiAvatarButton } from './EmojiAvatar';

interface BasicInfoSectionProps {
    logoEmoji: string;
    onEmojiPress: () => void;
    name: string;
    onNameChange: (text: string) => void;
    type: string;
    onTypePress: () => void;
    selectedStoreType: (typeof STORE_TYPES)[0];
    establishedYear: string;
    onYearPress: () => void;
    statusActive: boolean;
    onStatusChange: (value: boolean) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
    logoEmoji,
    onEmojiPress,
    name,
    onNameChange,
    type,
    onTypePress,
    selectedStoreType,
    establishedYear,
    onYearPress,
    statusActive,
    onStatusChange,
}) => (
    <View className='pt-5 pb-5'>
        <Text className='text-base font-semibold text-gray-900 mb-3'>Basic Information</Text>

        <View className='flex-row items-end gap-3 mb-3'>
            <EmojiAvatarButton emoji={logoEmoji} onPress={onEmojiPress} />
            <View className='flex-1'>
                <CustomLabel required>Store Name</CustomLabel>
                <CustomInput
                    value={name}
                    onChangeText={onNameChange}
                    placeholder='FreshMart Downtown'
                    autoCapitalize='words'
                />
            </View>
        </View>

        <View className='flex-row gap-2 mb-3'>
            <View className='flex-[2]'>
                <CustomLabel>Store Type</CustomLabel>
                <Selector onPress={onTypePress}>
                    <View className='flex-row items-center gap-2 flex-1'>
                        <Text className='text-lg'>{selectedStoreType.emoji}</Text>
                        <Text className='text-sm text-gray-900 flex-1'>{type}</Text>
                    </View>
                </Selector>
            </View>

            <View className='flex-1'>
                <CustomLabel>Established</CustomLabel>
                <Selector onPress={onYearPress}>
                    <Text
                        className={`text-sm flex-1 ${!establishedYear ? 'text-gray-400' : 'text-gray-900'}`}>
                        {establishedYear || 'Year'}
                    </Text>
                </Selector>
            </View>
        </View>

        <View className='flex-row justify-between items-center pt-3 border-t border-gray-200'>
            <CustomLabel>Store Status</CustomLabel>
            <View className='flex-row items-center gap-2'>
                <Text className='text-sm text-gray-500'>
                    {statusActive ? 'Active' : 'Inactive'}
                </Text>
                <Switch
                    value={statusActive}
                    onValueChange={onStatusChange}
                    trackColor={{ false: '#D1D5DB', true: '#111827' }}
                    thumbColor='#FFFFFF'
                />
            </View>
        </View>
    </View>
);
