import Store from '@/db/models/stores';
import User from '@/db/models/users';
import { Edit, LogOut, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ProfileCardProps {
    user: User;
    store: Store | null;
    onMyAccountPress: (userExternalId: string) => void;
    onEditPress: (userExternalId: string) => void;
    onLogoutPress: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    user,
    store,
    onMyAccountPress,
    onEditPress,
    onLogoutPress,
}) => {
    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            {/* Action Buttons */}
            <View className='flex-row justify-around mb-4 pb-4 border-b border-gray-100'>
                <TouchableOpacity
                    onPress={() => onMyAccountPress(user.externalId)}
                    className='flex-row items-center'>
                    <UserIcon size={18} color='#374151' />
                    <Text className='ml-2 text-sm text-gray-700'>My Account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onEditPress(user.externalId)}
                    className='flex-row items-center'>
                    <Edit size={18} color='#374151' />
                    <Text className='ml-2 text-sm text-gray-700'>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onLogoutPress} className='flex-row items-center'>
                    <LogOut size={18} color='#374151' />
                    <Text className='ml-2 text-sm text-gray-700'>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* User Info */}
            <View className='flex-row items-center'>
                <View className='w-12 h-12 rounded-full bg-gray-200 items-center justify-center'>
                    <Text className='text-lg font-semibold text-gray-700'>
                        {user.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <View className='ml-3 flex-1'>
                    <Text className='font-semibold text-gray-900 text-base'>{user.name}</Text>
                    <Text className='text-sm text-gray-500'>{user.email}</Text>
                    <View className='flex-row mt-1'>
                        <View className='bg-gray-100 rounded px-2 py-1 mr-2'>
                            <Text className='text-xs text-gray-600'>
                                {user.name || 'Staff Member'}
                            </Text>
                        </View>

                        <View className='bg-gray-100 rounded px-2 py-1'>
                            <Text className='text-xs text-gray-600'>
                                {store?.name ?? 'No Store available'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
