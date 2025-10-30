import React from 'react';
import { View, Text } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StatsCardProps {
    icon: LucideIcon;
    iconColor: string;
    label: string;
    value: string | number;
    valueColor?: string;
    bgColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    icon: Icon,
    iconColor,
    label,
    value,
    valueColor = 'text-gray-900',
    bgColor,
}) => {
    return (
        <View className={`flex-1 rounded-xl ${bgColor} p-4`}>
            <View className='flex-row items-center mb-2'>
                <Icon size={16} color={iconColor} />
                <Text className='ml-1 text-xs text-gray-600'>{label}</Text>
            </View>
            <Text className={`text-2xl font-bold ${valueColor}`}>{value}</Text>
        </View>
    );
};
