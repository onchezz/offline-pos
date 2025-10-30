import { AuthData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SignInFormProps {
    onSignUp: () => void;
    login: (userdata: AuthData) => void;
}

export function SignInForm({ onSignUp, login }: SignInFormProps) {
    const [formData, setFormData] = useState({
        email: 'test123@gmail.com',
        pin: '1234',
    });
    const [showPin, setShowPin] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSignIn = () => {
        // Validate form data
        if (!formData.email || !formData.pin) {
            // Handle validation error
            return;
        }
        // Handle sign in logic
        console.log('Signing in...');
        login(formData);
    };

    return (
        <View className='bg-white rounded-2xl p-6 shadow-sm'>
            {/* Header */}
            <View className='flex-row items-center mb-6'>
                <View className='w-8 h-8 bg-gray-900 rounded-full items-center justify-center mr-3'>
                    <Ionicons name='log-in-outline' size={16} color='white' />
                </View>
                <Text className='text-lg font-semibold text-gray-900'>Sign In</Text>
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

            {/* PIN */}
            <View className='mb-6'>
                <Text className='text-sm font-medium text-gray-900 mb-2'>4-digit PIN</Text>
                <View className='relative'>
                    <TextInput
                        className='bg-gray-100 rounded-lg px-4 py-3 text-gray-900 pr-12'
                        placeholder='Enter your 4-digit PIN'
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

            {/* Sign In Button */}
            <TouchableOpacity className='bg-gray-900 rounded-lg py-4 mb-6' onPress={handleSignIn}>
                <Text className='text-white text-center font-semibold text-base'>Sign In</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View className='items-center'>
                <Text className='text-gray-600'>
                    Don&apos;t have an account?{' '}
                    <Text className='text-gray-900 font-medium' onPress={onSignUp}>
                        Sign up here
                    </Text>
                </Text>
            </View>
        </View>
    );
}
