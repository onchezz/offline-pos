import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FormInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    maxLength?: number;
    showPasswordToggle?: boolean;
    onTogglePassword?: () => void;
    showPassword?: boolean;
}

export function FormInput({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    maxLength,
    showPasswordToggle = false,
    onTogglePassword,
    showPassword = false,
}: FormInputProps) {
    return (
        <View className='mb-4'>
            <Text className='text-sm font-medium text-gray-900 mb-2'>{label}</Text>
            <View className='relative'>
                <TextInput
                    className={`bg-gray-100 rounded-lg px-4 py-3 text-gray-900 ${
                        showPasswordToggle ? 'pr-12' : ''
                    }`}
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                />
                {showPasswordToggle && onTogglePassword && (
                    <TouchableOpacity
                        className='absolute right-4 top-1/2 -translate-y-1/2'
                        onPress={onTogglePassword}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color='#6B7280'
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
