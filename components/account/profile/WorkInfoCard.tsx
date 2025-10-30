import React from 'react';
import { View, Text } from 'react-native';
import { Briefcase, Shield } from 'lucide-react-native';

interface WorkInfoCardProps {
    joinDate: string;
    permissions: string[];
}

export const WorkInfoCard: React.FC<WorkInfoCardProps> = ({ joinDate, permissions }) => {
    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='flex-row items-center mb-4'>
                <Briefcase size={20} color='#374151' />
                <Text className='ml-2 font-semibold text-gray-900'>Work Information</Text>
            </View>

            {/* Join Date */}
            <View className='mb-4'>
                <Text className='text-sm text-gray-600 font-medium mb-2'>Join Date</Text>
                <View className='bg-gray-50 rounded-lg px-4 py-3'>
                    <Text className='text-gray-900'>{joinDate}</Text>
                </View>
            </View>

            {/* Permissions */}
            <View>
                <View className='flex-row items-center mb-2'>
                    <Shield size={16} color='#6B7280' />
                    <Text className='ml-2 text-sm text-gray-600 font-medium'>Permissions</Text>
                </View>
                <View className='flex-row flex-wrap gap-2'>
                    {permissions.map((permission) => (
                        <View key={permission} className='bg-gray-100 rounded-lg px-3 py-2'>
                            <Text className='text-xs text-gray-700'>{permission}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};
