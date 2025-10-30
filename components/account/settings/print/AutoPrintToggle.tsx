import { Ionicons } from '@expo/vector-icons';
import { View, Text, Switch } from 'react-native';

interface AutoPrintToggleProps {
    autoPrintReceipts: boolean;
    setAutoPrintReceipts: (value: boolean) => void;
}

export const AutoPrintToggle: React.FC<AutoPrintToggleProps> = ({
    autoPrintReceipts,
    setAutoPrintReceipts,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <View className='flex-row items-center mb-3'>
                <Ionicons name='print-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Thermal Printer Settings</Text>
            </View>

            <View className='flex-row items-start justify-between'>
                <View className='flex-1 mr-4'>
                    <Text className='text-sm font-semibold mb-1'>Auto-Print Receipts</Text>
                    <Text className='text-sm text-gray-500'>
                        Automatically print receipts after completing transactions
                    </Text>
                </View>
                <Switch
                    value={autoPrintReceipts}
                    onValueChange={setAutoPrintReceipts}
                    trackColor={{ false: '#d1d5db', true: '#000' }}
                    thumbColor='#fff'
                />
            </View>
        </View>
    );
};
