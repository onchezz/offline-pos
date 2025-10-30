import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type TabType = 'Overview' | 'Sales' | 'History';

interface TabSelectorProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
    const tabs: TabType[] = ['Overview', 'Sales', 'History'];

    return (
        <View className='mb-4 flex-row bg-white rounded-lg p-1 shadow-sm'>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => onTabChange(tab)}
                    className={`flex-1 rounded-lg py-2 ${
                        activeTab === tab ? 'bg-black' : 'bg-transparent'
                    }`}>
                    <Text
                        className={`text-sm font-medium text-center ${
                            activeTab === tab ? 'text-white' : 'text-gray-700'
                        }`}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
