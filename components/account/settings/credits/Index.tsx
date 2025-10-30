import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { CreditLimitsData } from '@/types';
import { AdvancedTab } from './advanced';
import { CreditLimitsTab } from './limits';

interface CreditSettingsProps {
    initialTab?: 'limits' | 'advanced';
    onSaveLimits?: (data: CreditLimitsData) => void;
    onToggleCreditSystem?: (enabled: boolean) => void;
}

const CreditSettings: React.FC<CreditSettingsProps> = ({
    initialTab = 'limits',
    onSaveLimits,
    onToggleCreditSystem,
}) => {
    const [activeTab, setActiveTab] = useState<'limits' | 'advanced'>(initialTab);

    return (
        <View className='flex-1 px-4 py-4'>
            {/* Tabs */}
            <View className='flex-row mb-4 gap-2'>
                <TouchableOpacity
                    onPress={() => setActiveTab('limits')}
                    className={`flex-1 py-3 rounded-lg items-center ${
                        activeTab === 'limits' ? 'bg-black' : 'bg-white border border-gray-200'
                    }`}>
                    <View className='flex-row items-center'>
                        <Ionicons
                            name='cash-outline'
                            size={18}
                            color={activeTab === 'limits' ? '#fff' : '#000'}
                        />
                        <Text
                            className={`ml-2 font-semibold ${
                                activeTab === 'limits' ? 'text-white' : 'text-black'
                            }`}>
                            Credit Limits
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab('advanced')}
                    className={`flex-1 py-3 rounded-lg items-center ${
                        activeTab === 'advanced' ? 'bg-black' : 'bg-white border border-gray-200'
                    }`}>
                    <View className='flex-row items-center'>
                        <Ionicons
                            name='settings-outline'
                            size={18}
                            color={activeTab === 'advanced' ? '#fff' : '#000'}
                        />
                        <Text
                            className={`ml-2 font-semibold ${
                                activeTab === 'advanced' ? 'text-white' : 'text-black'
                            }`}>
                            Advanced
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'limits' ? (
                <CreditLimitsTab onSave={onSaveLimits} />
            ) : (
                <AdvancedTab onSave={(data) => console.log('Save:', data)} />
            )}
        </View>
    );
};

export default CreditSettings;
