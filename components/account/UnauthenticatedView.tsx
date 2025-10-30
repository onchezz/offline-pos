import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export const UnauthenticatedView: React.FC = () => {
    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <View className='flex-1 justify-center items-center px-4'>
                <View className='bg-white rounded-2xl p-6 shadow-md w-full max-w-md'>
                    <Text className='text-xl font-semibold text-center mb-4'>Welcome Back</Text>
                    <Text className='text-gray-500 text-center mb-6'>
                        Please sign in to access your account
                    </Text>
                    <TouchableOpacity
                        className='w-full rounded-lg bg-blue-600 px-4 py-3'
                        onPress={() => router.push('/auth/signup')}>
                        <Text className='font-semibold text-white text-center'>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};
