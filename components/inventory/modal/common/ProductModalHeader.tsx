import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface Props {
    title: string;
    description?: string;
    onClose: () => void;
}

const ProductModalHeader: React.FC<Props> = ({ title, description, onClose }) => {
    return (
        <View className='flex-col'>
            <View className='flex flex-row justify-between items-center mb-2'>
                <Text className='text-xl font-bold text-black ml-2'>{title}</Text>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name='close' size={24} color='#666' className='mr-4 mt-4' />
                </TouchableOpacity>
            </View>
            {description ? (
                <Text className='text-gray-600 text-center mb-6'>{description}</Text>
            ) : null}
        </View>
    );
};

export default ProductModalHeader;
