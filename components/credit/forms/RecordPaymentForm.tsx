import { ActionButton } from '@/components/ui/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { CustomerSuggestionDropdown } from '../CustomerSuggestionDropdown';

import PaymentPopover from './PaymentPopover';

interface RecordPaymentFormProps {
    customerName: string;
    onCustomerNameChange: (name: string) => void;
    amountPaid: string;
    onAmountPaidChange: (amount: string) => void;
    showSuggestions: boolean;
    suggestedCustomers: any[];
    onSelectCustomer: (customer: any) => void;
    onRecord: (method?: string, details?: any) => void;
    // Optional: when true, require a selected customer before allowing record
    selectedCustomer?: any;
    requireCustomer?: boolean;
}

export const RecordPaymentForm: React.FC<RecordPaymentFormProps> = ({
    customerName,
    onCustomerNameChange,
    amountPaid,
    onAmountPaidChange,
    showSuggestions,
    suggestedCustomers,
    onSelectCustomer,
    onRecord,
    selectedCustomer,
    requireCustomer = false,
}) => {
    const [paymentMethod, setPaymentMethod] = React.useState<string | undefined>(undefined);
    const [paymentDetails, setPaymentDetails] = React.useState<any>(undefined);
    return (
        <View className='p-4 border-b border-gray-200'>
            <Text className='text-lg font-semibold mb-2'>Record Paid Credit</Text>
            <View className='flex-row justify-between mb-4'>
                <View className='flex-1 mr-2'>
                    <Text className='text-sm text-gray-600 mb-2'>Customer Name</Text>
                    <View className='relative'>
                        <View className='flex-row items-center bg-gray-100 rounded-lg px-3 '>
                            <Ionicons name='person-outline' size={18} color='#808080' />
                            <TextInput
                                className='flex-1 ml-2 text-base'
                                placeholder='Sam'
                                placeholderTextColor={'#808080'}
                                value={customerName}
                                onChangeText={onCustomerNameChange}
                            />
                        </View>

                        {showSuggestions && customerName && (
                            <CustomerSuggestionDropdown
                                customers={suggestedCustomers}
                                onSelectCustomer={onSelectCustomer}
                            />
                        )}
                    </View>
                </View>

                <View className='flex-1 ml-2'>
                    <Text className='text-sm text-gray-600 mb-2'>Amount Paid</Text>
                    <View className='flex-row items-center bg-gray-100 rounded-lg px-3'>
                        <Text className='text-gray-400'>$</Text>
                        <TextInput
                            className='flex-1 ml-2 text-base'
                            placeholder='20'
                            value={amountPaid}
                            placeholderTextColor={'#808080'}
                            onChangeText={onAmountPaidChange}
                            keyboardType='numeric'
                        />
                    </View>
                </View>
            </View>

            {amountPaid && (!requireCustomer || selectedCustomer) && (
                <View className='flex-row items-center space-x-2'>
                    <PaymentPopover
                        currentMethod={paymentMethod}
                        currentDetails={paymentDetails}
                        onApply={(m: string, details: any) => {
                            setPaymentMethod(m);
                            setPaymentDetails(details);
                        }}
                        onRemove={() => {
                            setPaymentMethod(undefined);
                            setPaymentDetails(undefined);
                        }}
                    />

                    <ActionButton
                        text='Record'
                        icon={CheckCircle}
                        onPress={() => onRecord(paymentMethod, paymentDetails)}
                        variant='primary'
                        size='md'
                        fullWidth
                    />
                </View>
            )}
        </View>
    );
};
