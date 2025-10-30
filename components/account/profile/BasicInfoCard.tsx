import React from 'react';
import { Text, TextInput, View } from 'react-native';
import PopoverPicker from '../../ui/PopoverPicker';
import { ProfileAvatar } from './ProfileAvatar';

interface BasicInfoCardProps {
    firstName: string;
    lastName: string;
    role: string;
    availableRoles?: string[];
    isEditing: boolean;
    onFirstNameChange: (text: string) => void;
    onLastNameChange: (text: string) => void;
    onRoleChange: (text: string) => void;
}

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
    firstName,
    lastName,
    role,
    availableRoles = [],
    isEditing,
    onFirstNameChange,
    onLastNameChange,
    onRoleChange,
}) => {
    const userInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='items-center mb-4'>
                <ProfileAvatar initials={userInitials} size='md' />
            </View>

            {/* First and Last Name */}
            <View className='flex-row gap-3 mb-3'>
                <View className='flex-1'>
                    <Text className='text-sm text-gray-600 font-medium mb-2'>First Name</Text>
                    {isEditing ? (
                        <TextInput
                            value={firstName}
                            onChangeText={onFirstNameChange}
                            className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                        />
                    ) : (
                        <View className='bg-gray-50 rounded-lg px-4 py-3'>
                            <Text className='text-gray-900 font-semibold'>{firstName}</Text>
                        </View>
                    )}
                </View>
                <View className='flex-1'>
                    <Text className='text-sm text-gray-600 font-medium mb-2'>Last Name</Text>
                    {isEditing ? (
                        <TextInput
                            value={lastName}
                            onChangeText={onLastNameChange}
                            className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                        />
                    ) : (
                        <View className='bg-gray-50 rounded-lg px-4 py-3'>
                            <Text className='text-gray-900 font-semibold'>{lastName}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Role */}
            <View>
                <Text className='text-sm text-gray-600 font-medium mb-2'>Role</Text>
                {isEditing ? (
                    <PopoverPicker
                        items={availableRoles}
                        selected={role}
                        placeholder='Select role'
                        onSelect={onRoleChange}
                        triggerClassName='bg-gray-50 rounded-lg px-4 py-3'
                        textClassName='text-gray-900'
                        searchPlaceholder='Search roles'
                    />
                ) : (
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900'>{role}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
