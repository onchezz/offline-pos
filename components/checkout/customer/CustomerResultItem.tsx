// components/checkout/Customer/CustomerResultItem.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const CustomerResultItem = ({ customer, onSelect }: any) => (
    <TouchableOpacity onPress={onSelect} className='p-3 border-b border-gray-700'>
        <Text className='font-medium text-white'>{customer.name}</Text>
        <Text className='text-sm text-gray-400'>{customer.phone}</Text>
    </TouchableOpacity>
);

export default CustomerResultItem;
