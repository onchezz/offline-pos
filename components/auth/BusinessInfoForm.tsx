import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import StoreForm from '../account/store/CreateStoreForm/StoreForm';
import { StoreData } from '../account/store/CreateStoreForm/types';

interface BusinessInfoFormProps {
    onBack: () => void;
    onCreateAccount: (businessStoreData: { businessName: string; store: StoreData }) => void;
}

export function BusinessInfoForm({ onBack, onCreateAccount }: BusinessInfoFormProps) {
    const [businessName, setBusinessName] = useState('Best Prices Ltd');
    const [storeData, setStoreData] = useState<StoreData>({
        name: 'best prices',
        address: '123 Main Street, Nairobi',
        establishedYear: '2020',
        phone: '+254712345678',
        email: 'store@freshmart.com',
        description:
            'Your friendly neighborhood convenience store offering fresh products and everyday essentials. We pride ourselves on quality service and community support.', // Will be removed in production
        currency: 'KES',
        timezone: 'Africa/Nairobi',
        receiptFooter: 'Thank you for shopping with us!\n Come again soon!',
        weekdayOpen: '08:00',
        weekdayClose: '22:00',
        weekendOpen: '09:00',
        weekendClose: '21:00',
        taxId: 'AE123456C',
        status: 'active',
    });

    const handleStoreCreate = async (data: StoreData) => {
        setStoreData((prev) => ({ ...prev, ...data }));
    };

    const handleCreateAccount = async () => {
        if (!businessName || !storeData.name || !storeData.address) {
            Alert.alert('Missing Information', 'Please fill in all required fields');
            return;
        }
        onCreateAccount({
            businessName,
            store: {
                name: storeData.name!,
                address: storeData.address,
                establishedYear: storeData.establishedYear,
                type: storeData.type,
                phone: storeData.phone,
                email: storeData.email,
                description: storeData.description,
                currency: storeData.currency,
                timezone: storeData.timezone,
                weekdayOpen: storeData.weekdayOpen,
                weekdayClose: storeData.weekdayClose,
                weekendOpen: storeData.weekendOpen,
                weekendClose: storeData.weekendClose,
                receiptFooter: storeData.receiptFooter,
                taxId: storeData.taxId,
                status: storeData.status,
            },
        });
    };

    return (
        <View>
            {/* Business Information Section */}
            <View className='mb-6'>
                <View className='flex-row items-center mb-4'>
                    <Ionicons name='business-outline' size={20} color='#374151' />
                    <Text className='text-lg font-semibold text-gray-900 ml-2'>
                        Business Information
                    </Text>
                </View>

                {/* Business Name */}
                <View className='mb-4'>
                    <Text className='text-sm font-medium text-gray-900 mb-2'>Business Name</Text>
                    <TextInput
                        className='bg-gray-100 rounded-lg px-4 py-3 text-gray-900'
                        placeholder='e.g., FreshMart Group'
                        value={businessName}
                        onChangeText={setBusinessName}
                    />
                </View>
            </View>

            {/* First Store Information Section (extracted) */}
            <View className='mb-6'>
                <View className='flex-row items-center mb-4'>
                    <Ionicons name='location-outline' size={20} color='#374151' />
                    <Text className='text-lg font-semibold text-gray-900 ml-2'>
                        First Store Information
                    </Text>
                </View>

                <StoreForm
                    initial={{
                        name: 'best prices',
                        address: '123 Main Street, Nairobi',
                        phone: '+254712345678',
                        email: 'store@freshmart.com',
                        establishedYear: '2020',
                        description:
                            'Your friendly neighborhood convenience store offering fresh products and everyday essentials. We pride ourselves on quality service and community support.', // Will be removed in production
                        currency: 'KES',
                        timezone: 'Africa/Nairobi',
                        receiptFooter: 'Thank you for shopping with us!\n Come again soon!', // Will be removed in production
                        taxId: 'AE123456C',
                        status: 'active',
                    }}
                    createDirect={false}
                    showFooterButtons={false}
                    onCreate={handleStoreCreate}
                    onCancel={onBack}
                    users={[]}
                />
            </View>

            {/* Action Buttons */}
            <View className='flex-row space-x-3'>
                <TouchableOpacity
                    className='flex-1 bg-white border border-gray-300 rounded-lg py-4'
                    onPress={onBack}>
                    <Text className='text-gray-900 text-center font-semibold text-base'>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className='flex-1 bg-gray-900 rounded-lg py-4'
                    onPress={handleCreateAccount}>
                    <Text className='text-white text-center font-semibold text-base'>
                        Create Account
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
