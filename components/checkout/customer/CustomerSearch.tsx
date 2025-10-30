// components/checkout/Customer/CustomerSearch.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

const CustomerSearch = ({
    customerSearchQuery,
    setCustomerSearchQuery,
    setShowAddCustomerModal,
    searching,
    isSearching,
    query,
    onQueryChange,
}: any) => (
    <>
        <View className='flex-row items-center justify-between mb-3 '>
            <Text className='text-sm font-medium text-black'>Search for customer</Text>
            <TouchableOpacity
                onPress={() => setShowAddCustomerModal(true)}
                className='flex-row items-center border border-gray-200 px-3 py-2 rounded-xl'>
                <Ionicons name='person-add-outline' size={16} color='black' />
                <Text className='text-black ml-2 text-sm font-semibold'>New</Text>
            </TouchableOpacity>
        </View>

        <View
            className={` rounded-lg px-2  flex-row items-center mb-2 bg-gray-200 ${searching ? 'border border-gray-400' : ''}`}>
            <Ionicons name='search-outline' size={20} color='#A9A9A9' />
            <TextInput
                className='flex-1 ml-3 text-black'
                placeholder='Search by name or phone...'
                placeholderTextColor='#A9A9A9'
                value={customerSearchQuery}
                onChangeText={setCustomerSearchQuery}
            />
        </View>
    </>
);

export default CustomerSearch;
