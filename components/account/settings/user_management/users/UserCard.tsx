import { User } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface UserCardProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
    isCurrent?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete, isCurrent }) => {
    const getInitials = (name: string): string => {
        const names = name.split(' ');
        return names
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    return (
        <View
            className={`rounded-lg p-4 mb-3 ${isCurrent ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'}`}>
            <View className='flex-row items-center'>
                {/* Avatar */}
                <View className='w-12 h-12 bg-gray-200 rounded-full items-center justify-center mr-3'>
                    <Text className='font-semibold text-base'>{getInitials(user.name)}</Text>
                </View>

                {/* User Info */}
                <View className='flex-1'>
                    <Text className='font-semibold text-base'>{user.name}</Text>
                    <Text className='text-gray-600 text-sm'>{user.email}</Text>
                    <Text className='text-gray-400 text-xs mt-1'>
                        Last login: {user.lastLogin || '—'}
                    </Text>
                </View>

                {/* Role Badge */}
                <View className='mr-3'>
                    <View
                        className={`px-3 py-1 rounded-full ${
                            user.role === 'Owner' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                        <Text
                            className={`text-xs font-medium ${
                                user.role === 'Owner' ? 'text-blue-700' : 'text-green-700'
                            }`}>
                            {user.role}
                        </Text>
                    </View>
                </View>

                {/* Active Badge */}
                {isCurrent && (
                    <View className='bg-black/80 px-3 py-1 rounded mr-2'>
                        <Text className='text-white text-xs font-medium'>You</Text>
                    </View>
                )}

                {/* Action Buttons */}
                <TouchableOpacity onPress={() => onEdit(user)} className='mr-2'>
                    <Ionicons name='create-outline' size={20} color='#000' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(user.externalId)}>
                    <Ionicons name='trash-outline' size={20} color='#000' />
                </TouchableOpacity>
            </View>
        </View>
    );
};
