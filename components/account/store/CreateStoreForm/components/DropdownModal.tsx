import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { ModalBase } from './ModalBase';

export const DropdownModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    title: string;
    value: string;
    options: string[];
    displayOptions?: string[];
    onSelect: (value: string) => void;
}> = ({ visible, onClose, title, value, options, displayOptions, onSelect }) => (
    <ModalBase visible={visible} onClose={onClose} title={title} maxHeight='60%'>
        <ScrollView className='px-4 py-3'>
            {options.map((option, index) => (
                <TouchableOpacity
                    key={option}
                    className={`py-3 px-3 rounded-md ${value === option ? 'bg-gray-100' : ''}`}
                    onPress={() => {
                        onSelect(option);
                        onClose();
                    }}>
                    <Text
                        className={`text-sm ${
                            value === option ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                        {displayOptions ? displayOptions[index] : option}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </ModalBase>
);
