import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { SetupTipItem } from './SetupTipItem';

export const PrinterSetupTips: React.FC = () => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <View className='flex-row items-center mb-3'>
                <Ionicons name='bulb-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Printer Setup Tips</Text>
            </View>

            {/* USB Thermal Printers */}
            <Text className='text-sm font-semibold mb-2'>For USB Thermal Printers:</Text>
            <SetupTipItem text='Install printer drivers from manufacturer' />
            <SetupTipItem text='Ensure printer is set as default in system settings' />
            <SetupTipItem text='Use 58mm or 80mm thermal paper' />

            {/* Network Printers */}
            <Text className='text-sm font-semibold mb-2 mt-3'>For Network Printers:</Text>
            <SetupTipItem text='Configure printer IP address in system' />
            <SetupTipItem text='Test connection from system print settings' />
            <SetupTipItem text='Ensure printer supports ESC/POS commands' />

            {/* Troubleshooting */}
            <Text className='text-sm font-semibold mb-2 mt-3'>Troubleshooting:</Text>
            <SetupTipItem text='Check paper roll is loaded correctly' />
            <SetupTipItem text='Verify printer is online and ready' />
            <SetupTipItem text='Try test print from system preferences first' />
        </View>
    );
};
