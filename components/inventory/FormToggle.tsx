import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
    label: string;
    description: string;
    value: boolean;
    onToggle: (value: boolean) => void;
}

const FormToggle = ({ label, description, value, onToggle }: Props) => {
    return (
        <View className='flex-row justify-between items-center'>
            <View className='flex-1'>
                <Text className='text-base font-semibold text-black mb-1'>{label}</Text>
                <Text className='text-sm text-gray-500'>{description}</Text>
            </View>
            <TouchableOpacity
                className={`w-12 h-6 rounded-full ${value ? 'bg-black' : 'bg-gray-300'}`}
                onPress={() => onToggle(!value)}>
                <View
                    className={`w-5 h-5 bg-white rounded-full mt-0.5 ${
                        value ? 'ml-6' : 'ml-0.5'
                    } transition-all duration-200`}
                />
            </TouchableOpacity>
        </View>
    );
};

export default FormToggle;
