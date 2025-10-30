import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ArrowLeft, User, Edit } from 'lucide-react-native';

interface ProfileHeaderProps {
    isEditing: boolean;
    onBack: () => void;
    onEdit: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ isEditing, onBack, onEdit }) => {
    return (
        <View className='bg-white px-4 py-3 flex-row justify-between items-center'>
            <View className='flex-row items-center'>
                <TouchableOpacity onPress={onBack} className='mr-3'>
                    <ArrowLeft size={24} color='#000' />
                </TouchableOpacity>
                <User size={24} color='#000' />
                <Text className='ml-2 text-lg font-semibold'>My Profile</Text>
            </View>
            {!isEditing && (
                <TouchableOpacity
                    onPress={onEdit}
                    className='flex-row items-center bg-gray-900 rounded-lg px-4 py-2'>
                    <Edit size={16} color='#FFFFFF' />
                    <Text className='ml-2 text-sm text-white font-medium'>Edit</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};
