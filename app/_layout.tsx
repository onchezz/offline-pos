import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css'; // <-- NativeWind entry

import { AuthProvider } from '@/contexts/AuthContext';
import { BusinessProvider } from '@/contexts/BusinessContext';
import { CartProvider } from '@/contexts/CartContext';
import { database } from '@/db';
import { useColorScheme } from '@/hooks/use-color-scheme';
import DatabaseProvider from '@nozbe/watermelondb/react/DatabaseProvider';

import React from 'react';
import { View } from 'react-native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Toast from 'react-native-toast-message';

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <DatabaseProvider database={database}>
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <KeyboardProvider preload={false}>
                    <BusinessProvider>
                        <AuthProvider>
                            <CartProvider>
                                {/* Root container using NativeWind */}
                                <View
                                    className={`flex-1 ${colorScheme === 'dark' ? 'bg-black' : 'bg-white'}`}>
                                    {/* Themed StatusBar using expo-status-bar */}
                                    <StatusBar
                                        style={colorScheme === 'dark' ? 'light' : 'dark'}
                                        backgroundColor={
                                            colorScheme === 'dark' ? '#fefe' : '#111827'
                                        }
                                    />

                                    <Stack screenOptions={{ headerShown: false }}>
                                        <Stack.Screen name='index' />
                                        <Stack.Screen name='(tabs)' />
                                        <Stack.Screen name='auth' />
                                    </Stack>
                                    {/* Toast container for app-wide toast messages */}
                                    <Toast />
                                </View>
                            </CartProvider>
                        </AuthProvider>
                    </BusinessProvider>
                    {/* your main application code goes here */}
                </KeyboardProvider>
            </ThemeProvider>
        </DatabaseProvider>
    );
}
