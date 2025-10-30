import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface Props {
    sale: any;
    items: any[];
    buildHtml: () => string;
}

const ReceiptActions: React.FC<Props> = ({ sale, items, buildHtml }) => {
    const onPrint = async () => {
        try {
        } catch (e) {
            console.error('Print failed', e);
            Toast.show({
                type: 'error',
                text1: 'Print failed',
                text2: String(e),
                position: 'bottom',
            });
        }
    };

    const [printerModalVisible, setPrinterModalVisible] = useState(false);

    const onShare = async () => {};

    return (
        <View className='flex-row mt-4 space-x-3'>
            <Pressable
                onPress={onPrint}
                className='flex-1 bg-black rounded-md py-3 items-center justify-center'>
                <Text className='text-white font-semibold'>Print Receipt</Text>
            </Pressable>
            <Pressable
                onPress={onShare}
                className='flex-1 border border-gray-300 rounded-md py-3 items-center justify-center'>
                <Text className='font-semibold'>Share</Text>
            </Pressable>
            <Pressable
                onPress={() => setPrinterModalVisible(true)}
                className='ml-2 px-3 py-3 rounded-md bg-blue-600 items-center justify-center'>
                <Text className='text-white font-semibold'>Thermal</Text>
            </Pressable>
        </View>
    );
};

export default ReceiptActions;
