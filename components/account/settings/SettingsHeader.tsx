import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text } from 'react-native';

interface SettingsHeaderProps {
    onBack: () => void;
    title: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
    onBack,
    title,
    icon = 'settings-outline',
}) => (
    <View className='bg-white px-4 py-4 border-b border-gray-200'>
        <View className='flex-row items-center'>
            <TouchableOpacity onPress={onBack} className='mr-3'>
                <Ionicons name='arrow-back' size={24} color='#000' />
            </TouchableOpacity>
            <View className='flex-row items-center'>
                <Ionicons name={icon} size={24} color='#000' />
                <Text className='text-xl font-semibold ml-2'>{title}</Text>
            </View>
        </View>
    </View>
);
