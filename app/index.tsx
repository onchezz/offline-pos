// app/index.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Buffer } from 'buffer';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

// Polyfill Buffer for native code that needs base64/Buffer (used by BLE writer)
(global as any).Buffer = (global as any).Buffer || Buffer;

export default function Index() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    return isAuthenticated ? <Redirect href='/checkout' /> : <Redirect href='/auth/login' />;
}
