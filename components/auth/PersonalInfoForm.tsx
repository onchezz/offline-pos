import { UserData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PersonalInfoFormProps {
    onContinue: (formData: UserData) => void;
}

export function PersonalInfoForm({ onContinue }: PersonalInfoFormProps) {
    const [formData, setFormData] = useState({
        name: 'onchez dev',
        email: 'test123@gmail.com',
        phone: '+254712345678',
        password: '1234',
        pin: '1234',
    });
    const [showPin, setShowPin] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleContinue = () => {
        // Validate form data
        if (!formData.name || !formData.email || !formData.pin || !formData.password) {
            // Handle validation error
            return;
        }
        onContinue(formData);
    };

    return (
        <View>
            {/* Full Name */}
            <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-900 mb-2'>Full Name</Text>
                <TextInput
                    className='bg-gray-100 rounded-lg px-4 py-3 text-gray-900'
                    placeholder='Enter your full name'
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                />
            </View>

            {/* Email */}
            <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-900 mb-2'>Email</Text>
                <TextInput
                    className='bg-gray-100 rounded-lg px-4 py-3 text-gray-900'
                    placeholder='Enter your email'
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType='email-address'
                    autoCapitalize='none'
                />
            </View>

            {/* Phone Number */}
            <View className='mb-4'>
                <Text className='text-sm font-medium text-gray-900 mb-2'>Phone Number</Text>
                <TextInput
                    className='bg-gray-100 rounded-lg px-4 py-3 text-gray-900'
                    placeholder='Enter your phone number'
                    value={formData.phone}
                    onChangeText={(value) => handleInputChange('phone', value)}
                    keyboardType='phone-pad'
                />
            </View>

            {/* PIN */}
            <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-900 mb-2'>Create 4-digit PIN</Text>
                <View className='relative'>
                    <TextInput
                        className='bg-gray-100 rounded-lg px-4 py-3 text-gray-900 pr-12'
                        placeholder='Create your 4-digit PIN'
                        value={formData.pin}
                        onChangeText={(value) => handleInputChange('pin', value)}
                        secureTextEntry={!showPin}
                        keyboardType='numeric'
                        maxLength={4}
                    />
                    <TouchableOpacity
                        className='absolute right-4 top-1/2 -translate-y-1/2'
                        onPress={() => setShowPin(!showPin)}>
                        <Ionicons
                            name={showPin ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color='#6B7280'
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity className='bg-gray-900 rounded-lg py-4' onPress={handleContinue}>
                <Text className='text-white text-center font-semibold text-base'>
                    Continue to Business Info
                </Text>
            </TouchableOpacity>
        </View>
    );
}
