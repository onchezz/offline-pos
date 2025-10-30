import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface EditableFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    isEditing: boolean;
    icon?: React.ReactNode;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    onChangeText,
    isEditing,
    icon,
    keyboardType = 'default',
    autoCapitalize,
}) => {
    return (
        <View className='mb-4'>
            <View className='flex-row items-center mb-2'>
                {icon}
                <Text className='ml-2 text-sm text-gray-600 font-medium'>{label}</Text>
            </View>
            {isEditing ? (
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                />
            ) : (
                <View className='bg-gray-50 rounded-lg px-4 py-3'>
                    <Text className='text-gray-900'>{value}</Text>
                </View>
            )}
        </View>
    );
};
