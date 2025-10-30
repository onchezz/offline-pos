import { Customer } from '@/types';
import { Search, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AddCustomerModal } from './modal/AddCustomerModal';

interface StoreCreditFormProps {
    creditAmount: string;
    onCreditAmountChange: (amount: string) => void;
    maxCredit: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isSearchFocused: boolean;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
    height: Animated.Value;
    opacity: Animated.Value;
}

export const StoreCreditForm: React.FC<StoreCreditFormProps> = ({
    creditAmount,
    onCreditAmountChange,
    maxCredit,
    searchQuery,
    onSearchChange,
    isSearchFocused,
    onSearchFocus,
    onSearchBlur,
    height,
    opacity,
}) => {
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

    const handleAddCustomer = (customer: Customer) => {
        console.log('New customer added:', customer);
        // You can handle the new customer data here
        // For example, add to a customer list or send to API
    };
    return (
        <>
            <Animated.View
                style={{
                    height: height,
                    opacity: opacity,
                    overflow: 'hidden',
                }}>
                <View className='bg-gray-50 mx-4 rounded-xl p-4 mb-3'>
                    <Text className='text-sm font-medium text-gray-900 mb-2'>
                        Amount to pay on credit
                    </Text>

                    <View className='mb-4'>
                        <View className='bg-white rounded-lg px-3 py-2 mb-1 border border-gray-200'>
                            <View className='flex-row items-center'>
                                <Text className='text-gray-500 text-sm mr-1'>$</Text>
                                <TextInput
                                    value={creditAmount}
                                    onChangeText={onCreditAmountChange}
                                    placeholder='0.00'
                                    placeholderTextColor='#9CA3AF'
                                    keyboardType='decimal-pad'
                                    className='text-lg font-medium text-gray-900 flex-1'
                                />
                            </View>
                        </View>
                        <Text className='text-gray-400 text-xs ml-1'>
                            Maximum: ${maxCredit.toFixed(2)}
                        </Text>
                    </View>

                    <View className='flex-row items-center justify-between mb-2'>
                        <Text className='text-sm font-medium text-gray-900'>
                            Search for customer
                        </Text>

                        <TouchableOpacity
                            className='flex-row items-center bg-white border border-gray-200 rounded-lg px-2 py-1'
                            onPress={() => setShowAddCustomerModal(true)}>
                            <UserPlus size={12} color='#6B7280' />
                            <Text className='text-gray-600 text-xs font-medium ml-1'>
                                New Customer
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className='bg-white rounded-lg px-3 py-2 border border-gray-200 flex-row items-center'>
                        <Search size={16} color='#9CA3AF' />
                        <TextInput
                            placeholder='Search by name or phone...'
                            className='flex-1 ml-2 text-gray-700 text-sm'
                            placeholderTextColor='#9CA3AF'
                            value={searchQuery}
                            onChangeText={onSearchChange}
                            onFocus={onSearchFocus}
                            onBlur={onSearchBlur}
                        />
                    </View>
                </View>
            </Animated.View>
            <AddCustomerModal
                visible={showAddCustomerModal}
                onClose={() => setShowAddCustomerModal(false)}
                onAddCustomer={handleAddCustomer}
            />
        </>
    );
};
