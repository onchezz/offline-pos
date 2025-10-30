import { AuthHeader } from '@/components/auth/AuthHeader';
import { SignInForm } from '@/components/auth/SignInForm';
import { useAuth } from '@/contexts/AuthContext';
import { authenticateUser } from '@/db/services/userService';
import { AuthData } from '@/types';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';

export default function SignInScreen() {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            console.log('SignInScreen: User authenticated, redirecting to /checkout');
            router.replace('/checkout');
        }
    }, [isAuthenticated]);

    const handleSignUp = () => {
        router.replace('/auth/signup');
    };

    const handleLogin = async (userdata: AuthData) => {
        try {
            console.log('Logging in with:', userdata);
            const user = await authenticateUser(userdata);
            if (!user) {
                console.log('Authentication failed');
                return;
            }
        } catch (e) {
            console.error('Login error:', e);
        }
    };

    return (
        <View className='flex-1 bg-gray-50'>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <AuthHeader title='Welcome Back' subtitle='Sign in to your POS system' />

                <View className='px-6 pb-8'>
                    <SignInForm onSignUp={handleSignUp} login={handleLogin} />
                </View>
            </ScrollView>
        </View>
    );
}
