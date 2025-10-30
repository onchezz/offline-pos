import { Redirect, Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <AuthGuard>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#FFFFFF', // White text/icon for active tab
                    tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
                    tabBarActiveBackgroundColor: '#000000', // Dark background for active tab
                    headerShown: false,
                    tabBarButton: HapticTab,
                    tabBarStyle: {
                        backgroundColor: Colors[colorScheme ?? 'light'].background,
                    },
                }}>
                <Tabs.Screen
                    name='checkout'
                    options={{
                        title: 'Checkout',
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                size={28}
                                name={focused ? 'cart.fill' : 'cart'}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='credit'
                    options={{
                        title: 'Credit',
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                size={28}
                                name={focused ? 'creditcard.fill' : 'creditcard'}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='inventory'
                    options={{
                        title: 'Inventory',
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                size={28}
                                name={focused ? 'cube.box.fill' : 'cube.box'}
                                color={color}
                            />
                        ),
                    }}
                />
                <Tabs.Screen
                    name='account'
                    options={{
                        title: 'Account',
                        tabBarIcon: ({ color, focused }) => (
                            <IconSymbol
                                size={28}
                                name={focused ? 'person.fill' : 'person'}
                                color={color}
                            />
                        ),
                    }}
                />
            </Tabs>
        </AuthGuard>
    );
}
