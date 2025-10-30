import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Save } from 'lucide-react-native';

interface EditModeActionsProps {
    onSave: () => void;
    onCancel: () => void;
}

export const EditModeActions: React.FC<EditModeActionsProps> = ({ onSave, onCancel }) => {
    return (
        <View className='flex-row gap-3 mb-4'>
            <TouchableOpacity
                onPress={onSave}
                className='flex-1 bg-black rounded-lg py-3 flex-row items-center justify-center'>
                <Save size={20} color='#FFFFFF' />
                <Text className='ml-2 text-white font-semibold'>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={onCancel}
                className='flex-1 bg-white border border-gray-300 rounded-lg py-3'>
                <Text className='text-gray-700 font-semibold text-center'>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};
