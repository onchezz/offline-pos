import { Ionicons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

interface PrinterConfigurationProps {
    printerName: string;
    setPrinterName: (value: string) => void;
    paperWidth: string;
    setPaperWidth: (value: string) => void;
    fontSize: string;
    setFontSize: (value: string) => void;
}

export const PrinterConfiguration: React.FC<PrinterConfigurationProps> = ({
    printerName,
    setPrinterName,
    paperWidth,
    setPaperWidth,
    fontSize,
    setFontSize,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <Text className='text-base font-semibold mb-4'>Printer Configuration</Text>

            {/* Printer Name */}
            <View className='mb-4'>
                <Text className='text-sm font-semibold mb-1'>Printer Name (Optional)</Text>
                <TextInput
                    value={printerName}
                    onChangeText={setPrinterName}
                    placeholder='e.g., Thermal Printer, Receipt Printer'
                    className='border border-gray-300 rounded-lg px-4 py-3 text-base'
                />
                <Text className='text-xs text-gray-500 mt-1'>
                    Leave empty to use system default printer
                </Text>
            </View>

            {/* Paper Width */}
            <View className='mb-4'>
                <Text className='text-sm font-semibold mb-2'>Paper Width</Text>
                <TouchableOpacity className='border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between'>
                    <Text className='text-base'>{paperWidth}</Text>
                    <Ionicons name='chevron-down' size={20} color='#666' />
                </TouchableOpacity>
            </View>

            {/* Font Size */}
            <View>
                <Text className='text-sm font-semibold mb-2'>Font Size</Text>
                <TouchableOpacity className='border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between'>
                    <Text className='text-base'>{fontSize}</Text>
                    <Ionicons name='chevron-down' size={20} color='#666' />
                </TouchableOpacity>
            </View>
        </View>
    );
};
