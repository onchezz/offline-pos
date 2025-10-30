import { View, Text } from 'react-native';
import { CreditInputField } from './CreditInputField';
import { Ionicons } from '@expo/vector-icons';

interface CreditLimitsFormProps {
    maxPerCustomer: string;
    setMaxPerCustomer: (value: string) => void;
    maxPerTransaction: string;
    setMaxPerTransaction: (value: string) => void;
    creditDays: string;
    setCreditDays: (value: string) => void;
}

export const CreditLimitsForm: React.FC<CreditLimitsFormProps> = ({
    maxPerCustomer,
    setMaxPerCustomer,
    maxPerTransaction,
    setMaxPerTransaction,
    creditDays,
    setCreditDays,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <View className='flex-row items-center mb-4'>
                <Ionicons name='cash-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Credit Limits</Text>
            </View>

            <CreditInputField
                label='Maximum Credit Per Customer ($)'
                description='Total credit limit for any single customer'
                value={maxPerCustomer}
                onChangeText={setMaxPerCustomer}
            />

            <CreditInputField
                label='Maximum Credit Per Transaction ($)'
                description='Maximum amount that can be purchased on credit in a single transaction'
                value={maxPerTransaction}
                onChangeText={setMaxPerTransaction}
            />

            <CreditInputField
                label='Default Credit Period (Days)'
                description='Number of days customers have to pay back credit'
                value={creditDays}
                onChangeText={setCreditDays}
            />
        </View>
    );
};
