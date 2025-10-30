import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Phone, Mail } from 'lucide-react-native';
import { EditableField } from './EditableField';

interface ContactInfoCardProps {
    phone: string;
    email: string;
    emergencyContact: string;
    isEditing: boolean;
    onPhoneChange: (text: string) => void;
    onEmailChange: (text: string) => void;
    onEmergencyContactChange: (text: string) => void;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
    phone,
    email,
    emergencyContact,
    isEditing,
    onPhoneChange,
    onEmailChange,
    onEmergencyContactChange,
}) => {
    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='flex-row items-center mb-4'>
                <Phone size={20} color='#374151' />
                <Text className='ml-2 font-semibold text-gray-900'>Contact Information</Text>
            </View>

            <EditableField
                label='Phone Number'
                value={phone}
                onChangeText={onPhoneChange}
                isEditing={isEditing}
                icon={<Phone size={16} color='#6B7280' />}
                keyboardType='phone-pad'
            />

            <EditableField
                label='Email Address'
                value={email}
                onChangeText={onEmailChange}
                isEditing={isEditing}
                icon={<Mail size={16} color='#6B7280' />}
                keyboardType='email-address'
                autoCapitalize='none'
            />

            <View>
                <Text className='text-sm text-gray-600 font-medium mb-2'>Emergency Contact</Text>
                {isEditing ? (
                    <TextInput
                        value={emergencyContact}
                        onChangeText={onEmergencyContactChange}
                        className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                        keyboardType='phone-pad'
                    />
                ) : (
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900'>{emergencyContact}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
