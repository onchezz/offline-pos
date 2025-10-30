import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SignUpCardProps {
    activeTab: 'personal' | 'business';
    onTabChange: (tab: 'personal' | 'business') => void;
    onSignIn: () => void;
    children: React.ReactNode;
}

export function SignUpCard({ activeTab, onTabChange, onSignIn, children }: SignUpCardProps) {
    return (
        <View className='bg-white rounded-2xl p-6 shadow-sm'>
            {/* Header */}
            <View className='flex-row items-center mb-6'>
                <View className='w-8 h-8 bg-gray-900 rounded-full items-center justify-center mr-3'>
                    <Ionicons name='person-add-outline' size={16} color='white' />
                </View>
                <Text className='text-lg font-semibold text-gray-900'>Sign Up</Text>
            </View>

            {/* Tabs */}
            <View className='flex-row bg-gray-100 rounded-lg p-1 mb-6'>
                <TouchableOpacity
                    className={`flex-1 py-3 rounded-md ${
                        activeTab === 'personal' ? 'bg-gray-900' : 'bg-transparent'
                    }`}
                    onPress={() => onTabChange('personal')}>
                    <Text
                        className={`text-center font-medium ${
                            activeTab === 'personal' ? 'text-white' : 'text-gray-700'
                        }`}>
                        Personal Info
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 py-3 rounded-md ${
                        activeTab === 'business' ? 'bg-gray-900' : 'bg-transparent'
                    }`}
                    onPress={() => onTabChange('business')}>
                    <Text
                        className={`text-center font-medium ${
                            activeTab === 'business' ? 'text-white' : 'text-gray-700'
                        }`}>
                        Business Info
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {children}

            {/* Sign In Link */}
            <View className='items-center mt-6'>
                <Text className='text-gray-600'>
                    Already have an account?{' '}
                    <Text className='text-gray-900 font-medium' onPress={onSignIn}>
                        Sign in here
                    </Text>
                </Text>
            </View>
        </View>
    );
}
