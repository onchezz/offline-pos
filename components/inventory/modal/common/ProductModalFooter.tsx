import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    loading: boolean;
    onCancel: () => void;
    onSubmit: () => void;
    disabled: boolean;
}

const ProductModalFooter: React.FC<Props> = ({ loading, onCancel, onSubmit, disabled }) => {
    return (
        <View className='flex-row px-2 py-2 space-x-3'>
            <TouchableOpacity
                className='flex-1 bg-gray-200 rounded-xl py-4 mx-2'
                onPress={onCancel}
                disabled={loading}>
                <Text className='text-center font-semibold text-gray-700'>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className={`flex-1 rounded-xl py-4 ${disabled ? 'bg-gray-300' : 'bg-black'}`}
                onPress={onSubmit}
                disabled={disabled || loading}>
                {loading ? (
                    <ActivityIndicator size='small' color='#FFFFFF' />
                ) : (
                    <Text
                        className={`text-center font-semibold ${disabled ? 'text-gray-500' : 'text-white'}`}>
                        Add Product
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ProductModalFooter;
