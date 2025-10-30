import { PaymentMethod } from '@/types';
import React from 'react';
import { Animated, Text, View } from 'react-native';
import { PaymentMethodCard } from './PaymentMethodCard';
import { StoreCreditForm } from './StoreCreditForm';

interface PaymentMethodsSectionProps {
    paymentMethods: PaymentMethod[];
    selectedPaymentMethod: string;
    onPaymentMethodSelect: (methodId: string) => void;
    // Store credit form props
    showStoreCreditForm: boolean;
    creditAmount: string;
    onCreditAmountChange: (amount: string) => void;
    maxCredit: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isSearchFocused: boolean;
    onSearchFocus: () => void;
    onSearchBlur: () => void;
    storeCreditFormHeight: Animated.Value;
    storeCreditOpacity: Animated.Value;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
    paymentMethods,
    selectedPaymentMethod,
    onPaymentMethodSelect,
    showStoreCreditForm,
    creditAmount,
    onCreditAmountChange,
    maxCredit,
    searchQuery,
    onSearchChange,
    isSearchFocused,
    onSearchFocus,
    onSearchBlur,
    storeCreditFormHeight,
    storeCreditOpacity,
}) => {
    // Find the index of store-credit in the array
    const storeCreditIndex = paymentMethods.findIndex((m) => m.id === 'store-credit');

    // Split based on the actual index position
    const beforeStoreCreditMethods = paymentMethods.filter(
        (method, index) => index < storeCreditIndex,
    );

    const storeCreditMethod = paymentMethods.find((method) => method.id === 'store-credit');

    const afterStoreCreditMethods = paymentMethods.filter(
        (method, index) => index > storeCreditIndex,
    );

    return (
        <View className='mx-4 mt-6'>
            <Text className='text-lg font-semibold text-gray-900 mb-4'>Payment Method</Text>

            {/* Payment methods before Store Credit */}
            {beforeStoreCreditMethods.map((method) => (
                <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedPaymentMethod === method.id}
                    onSelect={onPaymentMethodSelect}
                />
            ))}

            {/* Store Credit Payment Method */}
            {storeCreditMethod && (
                <PaymentMethodCard
                    key={storeCreditMethod.id}
                    method={storeCreditMethod}
                    isSelected={selectedPaymentMethod === storeCreditMethod.id}
                    onSelect={onPaymentMethodSelect}
                />
            )}

            {/* Store Credit Form - appears right after Store Credit method */}
            {showStoreCreditForm && (
                <StoreCreditForm
                    creditAmount={creditAmount}
                    onCreditAmountChange={onCreditAmountChange}
                    maxCredit={maxCredit}
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                    isSearchFocused={isSearchFocused}
                    onSearchFocus={onSearchFocus}
                    onSearchBlur={onSearchBlur}
                    height={storeCreditFormHeight}
                    opacity={storeCreditOpacity}
                />
            )}

            {/* Payment methods after Store Credit */}
            {afterStoreCreditMethods.map((method) => (
                <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedPaymentMethod === method.id}
                    onSelect={onPaymentMethodSelect}
                />
            ))}
        </View>
    );
};
