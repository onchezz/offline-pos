import React from 'react';
import { Text, View } from 'react-native';
import { CustomLabel, Selector } from './BasicUIComponents';

interface OperatingHoursSectionProps {
    weekdayOpen: string;
    weekdayClose: string;
    weekendOpen: string;
    weekendClose: string;
    formatTimeDisplay: (time: string) => string;
    onTimePress: (field: 'weekdayOpen' | 'weekdayClose' | 'weekendOpen' | 'weekendClose') => void;
}

export const OperatingHoursSection: React.FC<OperatingHoursSectionProps> = ({
    weekdayOpen,
    weekdayClose,
    weekendOpen,
    weekendClose,
    formatTimeDisplay,
    onTimePress,
}) => (
    <View className='pt-5 pb-5'>
        <Text className='text-base font-semibold text-gray-900 mb-3'>Operating Hours</Text>

        <View className='flex-row gap-2 mb-3'>
            <View className='flex-1'>
                <CustomLabel>Weekday Open</CustomLabel>
                <Selector onPress={() => onTimePress('weekdayOpen')}>
                    <Text className='text-sm text-gray-900'>
                        🕐 {formatTimeDisplay(weekdayOpen)}
                    </Text>
                </Selector>
            </View>

            <View className='flex-1'>
                <CustomLabel>Weekday Close</CustomLabel>
                <Selector onPress={() => onTimePress('weekdayClose')}>
                    <Text className='text-sm text-gray-900'>
                        🕐 {formatTimeDisplay(weekdayClose)}
                    </Text>
                </Selector>
            </View>
        </View>

        <View className='flex-row gap-2'>
            <View className='flex-1'>
                <CustomLabel>Weekend Open</CustomLabel>
                <Selector onPress={() => onTimePress('weekendOpen')}>
                    <Text className='text-sm text-gray-900'>
                        🕐 {formatTimeDisplay(weekendOpen)}
                    </Text>
                </Selector>
            </View>

            <View className='flex-1'>
                <CustomLabel>Weekend Close</CustomLabel>
                <Selector onPress={() => onTimePress('weekendClose')}>
                    <Text className='text-sm text-gray-900'>
                        🕐 {formatTimeDisplay(weekendClose)}
                    </Text>
                </Selector>
            </View>
        </View>
    </View>
);
