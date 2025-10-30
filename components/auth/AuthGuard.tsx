// this could be upgraded to include role guard
import { useAuth } from '@/contexts/AuthContext';
import { Href, Redirect } from 'expo-router';
import { ActivityIndicator, View, Text } from 'react-native';
import React from 'react';

interface AuthGuardProps {
    children: React.ReactNode;
    fallbackPath?: Href; // Default: '/auth/login'
    requireAuth?: boolean;
}

export function AuthGuard({
    children,
    fallbackPath = '/auth/login',
    requireAuth = true,
}: AuthGuardProps) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        console.log('🔒 AuthGuard: Checking authentication...');
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
                <Text style={{ marginTop: 12, color: '#666' }}>Loading...</Text>
            </View>
        );
    }

    // PROTECTED ROUTES: Require authentication
    if (requireAuth && !isAuthenticated) {
        console.log('🔒 AuthGuard: Not authenticated, redirecting to:', fallbackPath);
        return <Redirect href={fallbackPath} />;
    }

    // AUTH ROUTES: Redirect if already authenticated (e.g., login/signup pages)
    if (!requireAuth && isAuthenticated) {
        console.log(' AuthGuard: Already authenticated, redirecting to:', fallbackPath);
        return <Redirect href={fallbackPath} />;
    }

    console.log('AuthGuard: Access granted');
    return <>{children}</>;
}
