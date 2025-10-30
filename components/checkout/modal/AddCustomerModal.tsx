import { Customer } from '@/types';
import { X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AddCustomerModalProps {
    visible: boolean;
    onClose: () => void;
    onAddCustomer: (customerData: Customer) => void;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({
    visible,
    onClose,
    onAddCustomer,
}) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        if (!name.trim()) {
            return;
        }

        onAddCustomer({
            name: name.trim(),
            phone: phone.trim() || '',
            email: email.trim() || '',
            id: '',
            amount: 0,
            dueDate: '',
            rating: 'Low',
            daysLeft: 0,
            currentBalance: 0,
        });

        setName('');
        setPhone('');
        setEmail('');
        onClose();
    };

    const handleClose = () => {
        setName('');
        setPhone('');
        setEmail('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType='fade' onRequestClose={handleClose}>
            <View className='flex-1 bg-black/50 justify-center items-center'>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
                    className='w-11/12 max-w-md'>
                    <View className='bg-white rounded-2xl p-6'>
                        <View className='flex-row items-center justify-between mb-4'>
                            <Text className='text-xl font-bold text-gray-900'>
                                Add New Customer
                            </Text>
                            <TouchableOpacity onPress={handleClose}>
                                <X size={24} color='#6B7280' />
                            </TouchableOpacity>
                        </View>

                        <View className='mb-4'>
                            <Text className='text-sm font-medium text-gray-700 mb-2'>
                                Customer Name *
                            </Text>
                            <TextInput
                                value={name}
                                onChangeText={setName}
                                placeholder='Enter customer name'
                                className='bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900'
                                placeholderTextColor='#9CA3AF'
                            />
                        </View>

                        <View className='mb-4'>
                            <Text className='text-sm font-medium text-gray-700 mb-2'>
                                Phone Number (Optional)
                            </Text>
                            <TextInput
                                value={phone}
                                onChangeText={setPhone}
                                placeholder='Enter phone number'
                                keyboardType='phone-pad'
                                className='bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900'
                                placeholderTextColor='#9CA3AF'
                            />
                        </View>

                        <View className='mb-6'>
                            <Text className='text-sm font-medium text-gray-700 mb-2'>
                                Email (Optional)
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                placeholder='Enter email address'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                className='bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-900'
                                placeholderTextColor='#9CA3AF'
                            />
                        </View>

                        <View className='flex-row gap-3'>
                            <TouchableOpacity
                                onPress={handleClose}
                                className='flex-1 bg-gray-100 rounded-lg py-3'>
                                <Text className='text-gray-700 font-semibold text-center'>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={!name.trim()}
                                className={`flex-1 rounded-lg py-3 ${
                                    !name.trim() ? 'bg-gray-300' : 'bg-blue-600'
                                }`}>
                                <Text className='text-white font-semibold text-center'>
                                    Add Customer
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};
