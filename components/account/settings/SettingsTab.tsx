import { TabConfig } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';

interface SettingsTabProps {
    tab: TabConfig;
    activeTab: string;
    onPress: (tabId: string) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ tab, activeTab, onPress }) => {
    const isActive = activeTab === tab.id;

    return (
        <TouchableOpacity
            onPress={() => onPress(tab.id)}
            className={`rounded-lg mb-2 ${isActive ? 'bg-black' : 'bg-white border border-gray-200'}`}>
            <View className='flex-row items-center px-4 py-4'>
                <Ionicons name={tab.icon} size={20} color={isActive ? '#fff' : '#000'} />
                <View className='ml-3'>
                    <Text
                        className={`font-semibold text-base ${isActive ? 'text-white' : 'text-black'}`}>
                        {tab.title}
                    </Text>
                    <Text className={`text-sm ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                        {tab.description}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};
