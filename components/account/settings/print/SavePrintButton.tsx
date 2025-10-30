import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';

interface SavePrintButtonProps {
    onPress: () => void;
}

export const SavePrintButton: React.FC<SavePrintButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className='bg-black rounded-lg py-4 flex-row items-center justify-center mb-6'>
            <Ionicons name='save-outline' size={20} color='#fff' />
            <Text className='text-white font-semibold text-base ml-2'>Save Print Settings</Text>
        </TouchableOpacity>
    );
};
