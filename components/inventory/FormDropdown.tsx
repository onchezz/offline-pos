import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
}

const FormDropdown = ({
    label,
    required = false,
    placeholder,
    value,
    options,
    onSelect,
}: Props) => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <View style={{ position: 'relative', zIndex: showOptions ? 1000 : 1 }}>
            <Text className='text-base font-semibold text-black mb-2'>
                {label} {required && <Text className='text-red-500'>*</Text>}
            </Text>
            <TouchableOpacity
                className='bg-gray-100 rounded-lg px-4 py-3 flex-row justify-between items-center'
                onPress={() => setShowOptions(!showOptions)}>
                <Text className={value ? 'text-gray-700' : 'text-gray-400'}>
                    {value || placeholder}
                </Text>
                <Ionicons
                    name={showOptions ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color='#666'
                />
            </TouchableOpacity>

            {showOptions && (
                <View
                    className='absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1'
                    style={{
                        maxHeight: 200,
                        elevation: 5, // Android shadow
                        shadowColor: '#000', // iOS shadow
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                    }}>
                    <ScrollView
                        className='max-h-48'
                        showsVerticalScrollIndicator={true}
                        nestedScrollEnabled={true}>
                        {options.map((option, index) => (
                            <TouchableOpacity
                                key={option}
                                className={`px-4 py-3 ${
                                    index !== options.length - 1 ? 'border-b border-gray-100' : ''
                                }`}
                                onPress={() => {
                                    onSelect(option);
                                    setShowOptions(false);
                                }}>
                                <Text className='text-base text-gray-700'>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

export default FormDropdown;
