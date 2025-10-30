import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { PaymentMethodSelector } from '../PaymentMethodSelector';
import { ActionButton } from '@/components/ui/ActionButton';

interface MakePaymentFormProps {
    paymentAmount: string;
    onPaymentAmountChange: (amount: string) => void;
    paymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
    onSubmit: () => void;
}

export const MakePaymentForm: React.FC<MakePaymentFormProps> = ({
    paymentAmount,
    onPaymentAmountChange,
    paymentMethod,
    onPaymentMethodChange,
    onSubmit,
}) => {
    const canSubmit = paymentAmount && paymentMethod;

    return (
        <View className='mx-4 mt-6 mb-4 bg-white rounded-xl p-4 shadow-sm'>
            <Text className='text-lg font-semibold mb-4'>Make Payment</Text>

            {/* Payment Amount */}
            <View className='mb-4'>
                <Text className='text-sm text-gray-600 mb-2'>Payment Amount</Text>
                <View className='flex-row items-center bg-gray-100 rounded-lg px-4 py-3'>
                    <Text className='text-gray-600 text-base'>$</Text>
                    <TextInput
                        className='flex-1 ml-2 text-base'
                        placeholder='0.00'
                        value={paymentAmount}
                        onChangeText={onPaymentAmountChange}
                        keyboardType='decimal-pad'
                    />
                </View>
            </View>

            <PaymentMethodSelector
                selectedMethod={paymentMethod as any}
                onSelectMethod={onPaymentMethodChange}
            />

            {/* Submit Button */}
            {canSubmit && (
                <ActionButton
                    text='Record Payment'
                    icon={CheckCircle}
                    onPress={onSubmit}
                    variant='primary'
                    size='md'
                    fullWidth
                    className='mt-2 bg-green-600'
                />
            )}
        </View>
    );
};
