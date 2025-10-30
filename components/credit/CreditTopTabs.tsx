import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const CreditTopTabs: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        {
            name: 'Credits',
            path: '/credit',
            icon: 'card-outline' as const,
        },
        {
            name: 'Transactions',
            path: '/credit/transactions',
            icon: 'receipt-outline' as const,
        },
    ];

    const isActive = (path: string) => {
        if (path === '/credit') {
            return pathname === '/credit' || pathname === '/credit/';
        }
        return pathname.startsWith(path);
    };

    return (
        <View className='bg-white border-b border-gray-200'>
            <View className='flex-row'>
                {tabs.map((tab) => {
                    const active = isActive(tab.path);
                    return (
                        <TouchableOpacity
                            key={tab.path}
                            className='flex-1 flex-row items-center justify-center py-4 border-b-2'
                            style={{
                                borderBottomColor: active ? '#000' : 'transparent',
                            }}
                            onPress={() => router.push(tab.path as any)}>
                            <Ionicons
                                name={tab.icon}
                                size={20}
                                color={active ? '#000' : '#9CA3AF'}
                            />
                            <Text
                                className='ml-2 text-sm font-semibold'
                                style={{ color: active ? '#000' : '#9CA3AF' }}>
                                {tab.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
