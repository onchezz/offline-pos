// import { Customer } from '@/types';
import Customer from '@/db/models/customers';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CustomerSuggestionDropdownProps {
    customers: Customer[];
    onSelectCustomer: (customer: Customer) => void;
}

export const CustomerSuggestionDropdown: React.FC<CustomerSuggestionDropdownProps> = ({
    customers,
    onSelectCustomer,
}) => {
    if (customers.length === 0) return null;

    return (
        <View className='bg-white border border-gray-200 rounded-lg mt-1 shadow-sm absolute top-full left-0 right-0 z-10'>
            {customers.map((customer) => (
                <TouchableOpacity
                    key={customer.id}
                    className='p-3 border-b border-gray-100'
                    onPress={() => onSelectCustomer(customer)}>
                    <Text className='font-medium'>{customer.name}</Text>
                    <Text className='text-sm text-gray-500'>
                        {customer.name} • ${customer.currentBalance} due
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};
