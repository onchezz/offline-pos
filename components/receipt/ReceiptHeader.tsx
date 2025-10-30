import Store from '@/db/models/stores';
import capitalizeName from '@/utils/wordCapitlization';
import React from 'react';
import { Text, View } from 'react-native';

interface Props {
    store: Store;
    subtitle?: string;
    contactLine?: string;
}

const ReceiptHeader: React.FC<Props> = ({ store, subtitle, contactLine }) => {
    return (
        <View className='items-center mb-2'>
            <Text className='text-base font-bold text-gray-900'>
                {capitalizeName(store.name) || "AMARA'S DUKA"} Store
            </Text>
            <Text className='text-[10px] text-gray-500'>{store.email}</Text>
            {/* <Text className='text-xs text-gray-500'>{store}</Text> */}
            {subtitle ? <Text className='text-xs text-gray-500'>{subtitle}</Text> : null}
            {contactLine ? <Text className='text-[10px] text-gray-400'>{contactLine}</Text> : null}
        </View>
    );
};

export default ReceiptHeader;
