import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

export interface SetupTipItemProps {
    text: string;
}

export const SetupTipItem: React.FC<SetupTipItemProps> = ({ text }) => {
    return (
        <View className='flex-row items-start mb-2'>
            <Text className='text-gray-700 mr-2'>•</Text>
            <Text className='text-sm text-gray-600 flex-1'>{text}</Text>
        </View>
    );
};
