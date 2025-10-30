import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DollarSign, Smartphone, Building2, CreditCard } from 'lucide-react-native';
import { PaymentMethodType } from '@/types';

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethodType | '';
    onSelectMethod: (method: PaymentMethodType) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
    selectedMethod,
    onSelectMethod,
}) => {
    const methods: { id: PaymentMethodType; label: string; icon: any }[] = [
        { id: 'Cash', label: 'Cash', icon: DollarSign },
        { id: 'M-Pesa', label: 'M-Pesa', icon: Smartphone },
        { id: 'Bank Transfer', label: 'Bank Transfer', icon: Building2 },
        { id: 'Card', label: 'Card', icon: CreditCard },
    ];

    return (
        <View className='mb-4'>
            <Text className='text-sm text-gray-600 mb-2'>Payment Method</Text>
            <View className='flex-row flex-wrap gap-2'>
                {methods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedMethod === method.id;

                    return (
                        <TouchableOpacity
                            key={method.id}
                            className={`flex-1 min-w-[45%] py-3 rounded-lg border ${
                                isSelected ? 'bg-black border-black' : 'bg-white border-gray-300'
                            }`}
                            onPress={() => onSelectMethod(method.id)}>
                            <View className='flex-row items-center justify-center'>
                                <Icon size={18} color={isSelected ? '#fff' : '#666'} />
                                <Text
                                    className={`ml-2 font-medium ${
                                        isSelected ? 'text-white' : 'text-gray-700'
                                    }`}>
                                    {method.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
