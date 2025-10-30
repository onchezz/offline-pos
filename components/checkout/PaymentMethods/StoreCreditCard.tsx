import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
// Date picker
// We use the community datetimepicker package for a native date picker experience
import Customer from '@/db/models/customers';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
    selected: boolean;
    creditValue: number;
    creditAmount: string;
    roundedTotal: number;
    isPartialCredit: boolean;
    creditRemainingMethod: 'mpesa' | 'cash' | null;
    mpesaPhone: string;
    customerSearchQuery: string;
    searchResults: Customer[];
    selectedCustomer?: Customer | null;
    onSelect: () => void;
    onChangeCreditAmount: (v: string) => void;
    onSetCreditRemainingMethod: (m: 'mpesa' | 'cash' | null) => void;
    onSetMpesaPhone: (v: string) => void;
    onOpenAddCustomerModal: () => void;
    onSetCustomerSearchQuery: (v: string) => void;
    onSelectCustomer: (c: any) => void;
    dueDate?: string | null;
    onSetDueDate?: (d: string | null) => void;
};

export const StoreCreditCard: React.FC<Props> = ({
    selected,
    creditValue,
    creditAmount,
    roundedTotal,
    isPartialCredit,
    creditRemainingMethod,
    mpesaPhone,
    customerSearchQuery,
    searchResults,
    selectedCustomer,
    onSelect,
    onChangeCreditAmount,
    onSetCreditRemainingMethod,
    onSetMpesaPhone,
    onOpenAddCustomerModal,
    onSetCustomerSearchQuery,
    onSelectCustomer,
    dueDate,
    onSetDueDate,
}) => {
    const [showPicker, setShowPicker] = useState(false);

    // If the card becomes selected and there is no due date set yet,
    // default to 7 days from today.
    useEffect(() => {
        if (selected && !dueDate && typeof onSetDueDate === 'function') {
            const d = new Date();
            d.setDate(d.getDate() + 7);
            onSetDueDate(d.toISOString().split('T')[0]);
        }
    }, [selected, dueDate, onSetDueDate]);

    const parseDateOrToday = (d?: string | null) => {
        if (d) {
            const parsed = new Date(d);
            if (!isNaN(parsed.getTime())) return parsed;
        }
        return new Date();
    };

    const handleDateChange = (_event: any, selected?: Date | undefined) => {
        setShowPicker(false);
        if (selected) {
            const iso = selected.toISOString().split('T')[0];
            onSetDueDate && onSetDueDate(iso);
        }
    };
    return (
        <TouchableOpacity
            onPress={onSelect}
            className={`rounded-xl p-2 mb-4 ${selected ? 'bg-gray-900' : 'bg-gray-800'}`}>
            <View className='flex-row items-center'>
                <View className='w-8 h-8 bg-blue-500 rounded-lg items-center justify-center mr-3'>
                    <Ionicons name='card-outline' size={20} color='#fff' />
                </View>
                <View className='flex-1'>
                    <Text className='text-lg font-semibold text-white'>Store Credit</Text>
                    <Text className='text-sm text-gray-400'>Use customer credit</Text>
                </View>
                {creditValue > 0 && !selected && (
                    <View className='bg-blue-500 px-3 py-1 rounded-lg'>
                        <Text className='text-white font-semibold'>${creditValue.toFixed(2)}</Text>
                    </View>
                )}
            </View>

            {selected && (
                <View className='mt-4'>
                    <Text className='text-sm font-medium text-white mb-2'>
                        Amount to pay on credit
                    </Text>
                    <View className='flex-row items-center rounded-lg px-4  mb-1 bg-gray-800'>
                        <Text className='text-gray-400 mr-2'>$</Text>
                        <TextInput
                            className='flex-1 text-base text-white'
                            placeholder='0.00'
                            placeholderTextColor='#9CA3AF'
                            value={creditAmount}
                            onChangeText={onChangeCreditAmount}
                            keyboardType='decimal-pad'
                        />
                    </View>
                    <Text className='text-xs text-gray-400 mb-4'>
                        Maximum: ${roundedTotal - creditValue}
                    </Text>

                    {isPartialCredit && (
                        <View className='mb-4'>
                            <Text className='text-sm font-medium text-white mb-2'>
                                Pay remaining with:
                            </Text>
                            <View className='flex-row gap-2'>
                                <TouchableOpacity
                                    onPress={() => onSetCreditRemainingMethod('mpesa')}
                                    className={`flex-1 rounded-lg py-3 px-4 border ${creditRemainingMethod === 'mpesa' ? 'bg-green-500 border-green-500' : 'bg-gray-800 border-gray-700'}`}>
                                    <Text
                                        className={`text-center font-medium ${creditRemainingMethod === 'mpesa' ? 'text-white' : 'text-gray-400'}`}>
                                        M-Pesa
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => onSetCreditRemainingMethod('cash')}
                                    className={`flex-1 rounded-lg py-3 px-4 border ${creditRemainingMethod === 'cash' ? 'bg-orange-500 border-orange-500' : 'bg-gray-800 border-gray-700'}`}>
                                    <Text
                                        className={`text-center font-medium ${creditRemainingMethod === 'cash' ? 'text-white' : 'text-gray-400'}`}>
                                        Cash
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {creditRemainingMethod === 'mpesa' && (
                                <View className='mt-3'>
                                    <Text className='text-sm font-medium text-white mb-2'>
                                        M-Pesa phone number
                                    </Text>
                                    <View className='rounded-lg px-4  bg-gray-800'>
                                        <TextInput
                                            className='text-base text-white'
                                            placeholder='Phone number (07XX XXX XXX)'
                                            placeholderTextColor='#9CA3AF'
                                            value={mpesaPhone}
                                            onChangeText={onSetMpesaPhone}
                                            keyboardType='phone-pad'
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Due date for credit (native picker) */}
                    {onSetDueDate && (
                        <View className='mt-3'>
                            <Text className='text-sm font-medium text-white mb-2'>Due date</Text>

                            <View className='rounded-lg px-4 bg-gray-800'>
                                <TouchableOpacity
                                    onPress={() => setShowPicker(true)}
                                    className='py-3'>
                                    <Text className='text-base text-white'>
                                        {dueDate || 'Select due date'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View className='flex-row gap-2 mt-2'>
                                <TouchableOpacity
                                    onPress={() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + 7);
                                        onSetDueDate && onSetDueDate(d.toISOString().split('T')[0]);
                                    }}
                                    className='px-3 py-2 rounded-lg bg-gray-700'>
                                    <Text className='text-white text-sm'>Set +7 days</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => onSetDueDate && onSetDueDate(null)}
                                    className='px-3 py-2 rounded-lg bg-gray-700'>
                                    <Text className='text-white text-sm'>Clear</Text>
                                </TouchableOpacity>
                            </View>

                            {showPicker && (
                                <DateTimePicker
                                    value={parseDateOrToday(dueDate)}
                                    mode='date'
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>
                    )}

                    <View className='flex-row items-center justify-between mb-3'>
                        <Text className='text-sm font-medium text-white'>Search for customer</Text>
                        <TouchableOpacity
                            onPress={onOpenAddCustomerModal}
                            className='flex-row items-center bg-gray-800 px-3 py-2 rounded-lg'>
                            <Ionicons name='person-add-outline' size={16} color='#fff' />
                            <Text className='text-white ml-1 text-sm'>New Customer</Text>
                        </TouchableOpacity>
                    </View>

                    <View className='rounded-lg px-4  flex-row items-center mb-2 bg-gray-800'>
                        <Ionicons name='search-outline' size={20} color='#9CA3AF' />
                        <TextInput
                            className='flex-1 ml-3 text-white'
                            placeholder='Search by name or phone...'
                            placeholderTextColor='#9CA3AF'
                            value={customerSearchQuery}
                            onChangeText={onSetCustomerSearchQuery}
                        />
                    </View>

                    {searchResults.length > 0 && (
                        <View className='border border-gray-700 rounded-lg mb-2 bg-gray-800'>
                            {searchResults.map((customer) => (
                                <TouchableOpacity
                                    key={customer.id}
                                    onPress={() => onSelectCustomer(customer)}
                                    className='p-3 border-b border-gray-700'>
                                    <Text className='font-medium text-white'>{customer.name}</Text>
                                    <Text className='text-sm text-gray-400'>{customer.phone}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};
