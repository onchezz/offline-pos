import { AuthGuard } from '@/components/auth/AuthGuard';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AuthLayout() {
    return (
        <>
            <AuthGuard requireAuth={false} fallbackPath='/checkout'>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name='index'
                        options={{
                            title: 'LogIn',
                        }}
                    />
                    <Stack.Screen
                        name='signup'
                        options={{
                            title: 'Create Account',
                        }}
                    />
                </Stack>
                <StatusBar style='auto' />
            </AuthGuard>
        </>
    );
}
