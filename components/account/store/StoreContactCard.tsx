import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EditableField } from './EditableField';

interface StoreContactCardProps {
    phone: string;
    email: string;
    address: string;
    isEditing: boolean;
    onPhoneChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onAddressChange: (text: string) => void;
}

export const StoreContactCard: React.FC<StoreContactCardProps> = ({
    phone,
    email,
    address,
    isEditing,
    onPhoneChange,
    onEmailChange,
    onAddressChange,
}) => {
    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='flex-row items-center mb-4'>
                <Ionicons name='call-outline' size={20} color='#374151' />
                <Text className='ml-2 font-semibold text-gray-900'>Contact Information</Text>
            </View>

            <EditableField
                label='Phone Number'
                value={phone}
                onChangeText={onPhoneChange}
                isEditing={isEditing}
                icon='call-outline'
                keyboardType='phone-pad'
            />

            <EditableField
                label='Email Address'
                value={email}
                onChangeText={onEmailChange}
                isEditing={isEditing}
                icon='mail-outline'
                keyboardType='email-address'
                autoCapitalize='none'
            />

            <View>
                <View className='flex-row items-center mb-2'>
                    <Ionicons name='location-outline' size={16} color='#6B7280' />
                    <Text className='ml-2 text-sm text-gray-600 font-medium'>Address</Text>
                </View>
                <EditableField
                    label=''
                    value={address}
                    onChangeText={onAddressChange}
                    isEditing={isEditing}
                    multiline
                    numberOfLines={3}
                />
            </View>
        </View>
    );
};
