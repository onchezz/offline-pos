import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BusinessDetailsCardProps {
    description: string;
    weekdayHours: string;
    weekendHours: string;
    taxId: string;
    established: string;
    isEditing: boolean;
    onDescriptionChange: (text: string) => void;
    onWeekdayHoursChange: (text: string) => void;
    onWeekendHoursChange: (text: string) => void;
}

export const BusinessDetailsCard: React.FC<BusinessDetailsCardProps> = ({
    description,
    weekdayHours,
    weekendHours,
    taxId,
    established,
    isEditing,
    onDescriptionChange,
    onWeekdayHoursChange,
    onWeekendHoursChange,
}) => {
    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='flex-row items-center mb-4'>
                <Ionicons name='briefcase-outline' size={20} color='#374151' />
                <Text className='ml-2 font-semibold text-gray-900'>Business Details</Text>
            </View>

            {/* Store Description */}
            <View className='mb-4'>
                <Text className='text-sm text-gray-600 font-medium mb-2'>Store Description</Text>
                {isEditing ? (
                    <TextInput
                        value={description}
                        onChangeText={onDescriptionChange}
                        className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                        multiline
                        numberOfLines={5}
                    />
                ) : (
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900'>{description}</Text>
                    </View>
                )}
            </View>

            {/* Business Hours */}
            <View className='mb-4'>
                <View className='flex-row items-center mb-2'>
                    <Ionicons name='time-outline' size={16} color='#6B7280' />
                    <Text className='ml-2 text-sm text-gray-600 font-medium'>Business Hours</Text>
                </View>
                {isEditing ? (
                    <View>
                        <TextInput
                            value={weekdayHours}
                            onChangeText={onWeekdayHoursChange}
                            className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900 mb-2'
                            placeholder='Monday - Saturday hours'
                        />
                        <TextInput
                            value={weekendHours}
                            onChangeText={onWeekendHoursChange}
                            className='bg-gray-50 rounded-lg px-4 py-3 text-gray-900'
                            placeholder='Sunday hours'
                        />
                    </View>
                ) : (
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900'>{weekdayHours}</Text>
                        <Text className='text-gray-900 mt-1'>{weekendHours}</Text>
                    </View>
                )}
            </View>

            {/* Tax ID and Established */}
            <View className='flex-row gap-3'>
                <View className='flex-1'>
                    <View className='flex-row items-center mb-2'>
                        <Ionicons name='document-text-outline' size={16} color='#6B7280' />
                        <Text className='ml-2 text-sm text-gray-600 font-medium'>Tax ID</Text>
                    </View>
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900'>{taxId}</Text>
                    </View>
                </View>
                <View className='flex-1'>
                    <View className='flex-row items-center mb-2'>
                        <Ionicons name='calendar-outline' size={16} color='#6B7280' />
                        <Text className='ml-2 text-sm text-gray-600 font-medium'>Established</Text>
                    </View>
                    <View className='bg-gray-50 rounded-lg px-4 py-3'>
                        <Text className='text-gray-900'>{established}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
