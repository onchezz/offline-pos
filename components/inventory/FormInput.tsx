import React from 'react';
import { Text, TextInput, View } from 'react-native';

interface Props {
    label?: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'decimal-pad';
    multiline?: boolean;
    numberOfLines?: number;
    textAlignVertical?: 'top' | 'bottom' | 'center';
}

const FormInput = ({
    label,
    required = false,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    multiline = false,
    numberOfLines = 1,
    textAlignVertical = 'center',
}: Props) => {
    return (
        <View>
            <Text className='text-base font-semibold text-black mb-2'>
                {label} {required && <Text className='text-red-500'>*</Text>}
            </Text>
            <TextInput
                className='bg-gray-100 rounded-lg px-4 py-3 text-gray-700 text-base'
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                placeholderTextColor='#999'
                multiline={multiline}
                numberOfLines={numberOfLines}
                textAlignVertical={textAlignVertical}
            />
        </View>
    );
};

export default FormInput;
