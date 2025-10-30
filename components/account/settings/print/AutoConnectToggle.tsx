import { Ionicons } from '@expo/vector-icons';
import { Switch, Text, View } from 'react-native';

interface AutoConnectToggleProps {
    autoConnect: boolean;
    setAutoConnect: (value: boolean) => void;
}

const AutoConnectToggle: React.FC<AutoConnectToggleProps> = ({ autoConnect, setAutoConnect }) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <View className='flex-row items-center mb-3'>
                <Ionicons name='bluetooth-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Connection</Text>
            </View>

            <View className='flex-row items-start justify-between'>
                <View className='flex-1 mr-4'>
                    <Text className='text-sm font-semibold mb-1'>Auto-Connect to Printer</Text>
                    <Text className='text-sm text-gray-500'>
                        Try to automatically connect to your preferred printer when printing
                    </Text>
                </View>
                <Switch
                    value={autoConnect}
                    onValueChange={setAutoConnect}
                    trackColor={{ false: '#d1d5db', true: '#000' }}
                    thumbColor='#fff'
                />
            </View>
        </View>
    );
};

export default AutoConnectToggle;
