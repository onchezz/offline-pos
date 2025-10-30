// components/checkout/Customer/SelectedCustomerCard.tsx
import React from 'react';
import { View, Text } from 'react-native';

const SelectedCustomerCard = ({ customer }: any) => (
    <View className='bg-green-900 border border-green-500 rounded-lg p-3'>
        <Text className='font-medium text-green-100'>✓ {customer.name}</Text>
        <Text className='text-sm text-green-300'>{customer.phone}</Text>
    </View>
);

export default SelectedCustomerCard;
