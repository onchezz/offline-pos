import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export const ModalBase: React.FC<{
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxHeight?: string;
}> = ({ visible, onClose, title, children, maxHeight = '80%' }) => (
    <Modal visible={visible} animationType='slide' transparent>
        <View className='flex-1 bg-black/50 justify-end'>
            <View className='bg-white rounded-t-2xl'>
                <View className='flex-row justify-between items-center px-4 py-3 border-b border-gray-200'>
                    <Text className='text-base font-semibold text-gray-900'>{title}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <Text className='text-2xl text-gray-500'>✕</Text>
                    </TouchableOpacity>
                </View>
                {children}
            </View>
        </View>
    </Modal>
);
