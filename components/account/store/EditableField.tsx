import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EditableFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    isEditing: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean;
    numberOfLines?: number;
    placeholder?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    onChangeText,
    isEditing,
    icon,
    keyboardType = 'default',
    autoCapitalize,
    multiline = false,
    numberOfLines,
    placeholder,
}) => {
    return (
        <View className='mb-4'>
            <View className='flex-row items-center mb-2'>
                {icon && <Ionicons name={icon} size={16} color='#6B7280' />}
                <Text className='ml-2 text-sm text-gray-600 font-medium'>{label}</Text>
            </View>
            {isEditing ? (
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    placeholder={placeholder}
                />
            ) : (
                <View className='bg-gray-50 rounded-lg px-4 py-3'>
                    <Text className='text-gray-900'>{value}</Text>
                </View>
            )}
        </View>
    );
};
