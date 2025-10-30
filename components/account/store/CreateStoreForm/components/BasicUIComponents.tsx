import React from 'react';
import { Text, TextInput, TouchableOpacity } from 'react-native';

export const CustomButton: React.FC<{
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'outline';
    disabled?: boolean;
}> = ({ onPress, title, variant = 'primary', disabled }) => (
    <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        className={`flex-1 py-3 rounded-md justify-center items-center ${
            variant === 'primary' ? 'bg-gray-900' : 'bg-white border border-gray-300'
        } ${disabled ? 'opacity-50' : ''}`}>
        <Text
            className={`text-sm font-semibold ${
                variant === 'primary' ? 'text-white' : 'text-gray-700'
            } ${disabled ? 'text-gray-400' : ''}`}>
            {title}
        </Text>
    </TouchableOpacity>
);

export const CustomInput: React.FC<{
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: any;
    autoCapitalize?: any;
    numberOfLines?: number;
}> = ({ value, onChangeText, placeholder, keyboardType, autoCapitalize, numberOfLines }) => (
    <TextInput
        className='bg-gray-100  border-gray-200 rounded-md px-3 py-2.5 text-sm text-gray-900'
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor='#9CA3AF'
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        numberOfLines={numberOfLines}
    />
);

export const CustomLabel: React.FC<{ children: React.ReactNode; required?: boolean }> = ({
    children,
    required,
}) => (
    <Text className='text-sm font-medium text-gray-700 mb-1.5'>
        {children}
        {required && <Text className='text-red-500'> *</Text>}
    </Text>
);

export const Selector: React.FC<{
    onPress: () => void;
    children: React.ReactNode;
}> = ({ onPress, children }) => (
    <TouchableOpacity
        className='bg-white border border-gray-200 rounded-md px-3 py-2.5 flex-row justify-between items-center'
        onPress={onPress}>
        {children}
        <Text className='text-xs text-gray-400 ml-2'>▼</Text>
    </TouchableOpacity>
);
