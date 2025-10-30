import React from 'react';
import { Switch, Text, View } from 'react-native';
import { CustomLabel, Selector } from './BasicUIComponents';

interface StoreSettingsSectionProps {
    currency: string;
    onCurrencyPress: () => void;
    timezone: string;
    onTimezonePress: () => void;
    wholesaleEnabled?: boolean;
    onToggleWholesale?: (enabled: boolean) => void;
}

export const StoreSettingsSection: React.FC<StoreSettingsSectionProps> = ({
    currency,
    onCurrencyPress,
    timezone,
    onTimezonePress,
    wholesaleEnabled = false,
    onToggleWholesale,
}) => (
    <View className='pt-5 pb-5'>
        <Text className='text-base font-semibold text-gray-900 mb-3'>Store Settings</Text>

        <View className='flex-row gap-2'>
            <View className='flex-1'>
                <CustomLabel>Currency</CustomLabel>
                <Selector onPress={onCurrencyPress}>
                    <Text className='text-sm text-gray-900'>{currency}</Text>
                </Selector>
            </View>

            <View className='flex-1'>
                <CustomLabel>Timezone</CustomLabel>
                <Selector onPress={onTimezonePress}>
                    <Text className='text-sm text-gray-900' numberOfLines={1}>
                        {timezone}
                    </Text>
                </Selector>
            </View>
        </View>

        <View className='pt-3'>
            <CustomLabel>Enable Wholesale Pricing</CustomLabel>
            <View className='mt-2'>
                <Text className='text-sm text-gray-700 mb-2'>
                    Allow this store to sell at wholesale prices.
                </Text>
                <View className='flex-row items-center'>
                    <Text className='flex-1 text-sm text-gray-900'>Wholesale Pricing</Text>
                    <Switch
                        value={wholesaleEnabled}
                        onValueChange={() => onToggleWholesale?.(!wholesaleEnabled)}
                        trackColor={{ false: '#D1D5DB', true: '#111827' }}
                        thumbColor='#FFFFFF'
                    />
                    {/* <Selector onPress={() => onToggleWholesale?.(!wholesaleEnabled)}>
                        <Text className='text-sm text-gray-900'>
                            {wholesaleEnabled ? 'Enabled' : 'Disabled'}
                        </Text>
                    </Selector> */}
                </View>
            </View>
        </View>
    </View>
);
