import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react-native';

interface AccountHeaderProps {
    onSettingsPress: () => void;
}

export const AccountHeader: React.FC<AccountHeaderProps> = ({ onSettingsPress }) => {
    return (
        <View className='bg-white px-4 py-3 flex-row justify-between items-center'>
            <Text className='text-xl font-bold text-gray-900'>Account</Text>
            <TouchableOpacity onPress={onSettingsPress}>
                <Settings size={24} color='#000' />
            </TouchableOpacity>
        </View>
    );
};
