import { AddCustomerModal } from '@/components/checkout/modal/AddCustomerModal';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CashCard } from '@/components/checkout/PaymentMethods/CashCard';
import { MpesaCard } from '@/components/checkout/PaymentMethods/MpesaCard';
import { PaymentButton } from '@/components/checkout/PaymentMethods/payment-button';
import { StoreCreditCard } from '@/components/checkout/PaymentMethods/StoreCreditCard';
import { Header } from '@/components/common/Header';
import { useBusiness } from '@/contexts/BusinessContext';
import { useCart } from '@/contexts/CartContext';
import { useCheckout } from '@/hooks/useCheckout';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const PaymentScreen: React.FC = () => {
    const { cart, updateDiscount } = useCart();
    const { selectedStore } = useBusiness();
    // const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
    const [showPartialPaymentOptions, setShowPartialPaymentOptions] = useState<
        'cash' | 'mpesa' | null
    >(null);

    const {
        selectedPaymentMethod,
        mpesaAmount,
        mpesaPhone,
        cashAmount,
        creditAmount,
        creditRemainingMethod,
        customerSearchQuery,
        selectedCustomer,
        searchResults,
        isProcessing,
        isPartialCredit,
        isPartialCash,
        isPartialMpesa,
        remainingAmount,
        mpesaValue,
        cashValue,
        creditValue,
        selectPaymentMethod,
        switchToPartialPayment,
        setMpesaAmount,
        setCashAmount,
        setCreditAmount,
        setMpesaPhone,
        setCreditRemainingMethod,
        setCustomerSearchQuery,
        selectCustomer: setSelectedCustomer,
        createAndSelectCustomer,

        processPayment,
        canProcessPayment,
        getPaymentError,
        total,
        roundedTotal,
        dueDate,
        setDueDate,
    } = useCheckout(
        cart,
        cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );

    const handleProcessPayment = async () => {
        const result = await processPayment();
        if (result?.success) {
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Payment processed successfully!',
                position: 'top',
            });

            if (result.saleId) router.push(`/checkout/receipt/${result.saleId}`);
        } else {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to process payment. Please try again.',
                position: 'bottom',
            });
        }
    };

    const handlePartialPaymentSelect = (
        fromMethod: 'cash' | 'mpesa',
        toMethod: 'mpesa' | 'cash' | 'store-credit',
    ) => {
        switchToPartialPayment(fromMethod, toMethod);
        setShowPartialPaymentOptions(null);
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className='flex-1'>
                <ScrollView
                    className='flex-1'
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'>
                    <Header title='Chekout' showBackButton={true} />

                    <OrderSummary
                        cartItems={cart}
                        total={total}
                        onItemDiscountChange={(
                            itemId: string,
                            discount: number,
                            mode?: 'percent' | 'amount',
                        ) => {
                            // Persist per-item discount into cart so it's included in sale creation
                            updateDiscount(itemId, discount, mode);
                        }}
                        customerQuery={customerSearchQuery}
                        customerResults={searchResults}
                        onCustomerQueryChange={setCustomerSearchQuery}
                        onSelectCustomer={setSelectedCustomer}
                        // onCreateCustomer={createAndSelectCustomer}
                        selectedCustomer={selectedCustomer}
                        onOpenAddCustomerModal={() => setShowAddCustomerModal(true)}
                        currency={selectedStore?.currency || 'Kes'} // onExcludeCustomer={excludeCustomer}
                    />

                    <View className='px-4 py-4'>
                        <Text className='my-2 font-bold'> Payment Method</Text>
                        <CashCard
                            selected={selectedPaymentMethod === 'cash'}
                            cashValue={cashValue}
                            cashAmount={cashAmount}
                            isPartialCash={isPartialCash}
                            remainingAmount={remainingAmount}
                            showPartialOptions={showPartialPaymentOptions === 'cash'}
                            onSelect={() => selectPaymentMethod('cash')}
                            onChangeAmount={setCashAmount}
                            onShowPartialOptions={() => setShowPartialPaymentOptions('cash')}
                            onChoosePartialMpesa={() => handlePartialPaymentSelect('cash', 'mpesa')}
                            onChoosePartialStoreCredit={() =>
                                handlePartialPaymentSelect('cash', 'store-credit')
                            }
                        />

                        <MpesaCard
                            selected={selectedPaymentMethod === 'mpesa'}
                            mpesaValue={mpesaValue}
                            mpesaAmount={mpesaAmount}
                            mpesaPhone={mpesaPhone}
                            isPartialMpesa={isPartialMpesa}
                            remainingAmount={remainingAmount}
                            showPartialOptions={showPartialPaymentOptions === 'mpesa'}
                            onSelect={() => selectPaymentMethod('mpesa')}
                            onChangeAmount={setMpesaAmount}
                            onChangePhone={setMpesaPhone}
                            onShowPartialOptions={() => setShowPartialPaymentOptions('mpesa')}
                            onChoosePartialCash={() => handlePartialPaymentSelect('mpesa', 'cash')}
                            onChoosePartialStoreCredit={() =>
                                handlePartialPaymentSelect('mpesa', 'store-credit')
                            }
                        />

                        <StoreCreditCard
                            selected={selectedPaymentMethod === 'store-credit'}
                            creditValue={creditValue}
                            creditAmount={creditAmount}
                            roundedTotal={roundedTotal}
                            isPartialCredit={isPartialCredit}
                            creditRemainingMethod={creditRemainingMethod}
                            mpesaPhone={mpesaPhone}
                            customerSearchQuery={customerSearchQuery}
                            searchResults={searchResults}
                            selectedCustomer={selectedCustomer}
                            onSelect={() => selectPaymentMethod('store-credit')}
                            onChangeCreditAmount={setCreditAmount}
                            onSetCreditRemainingMethod={(m) => m && setCreditRemainingMethod(m)}
                            onSetMpesaPhone={(v) => setMpesaPhone(v)}
                            onOpenAddCustomerModal={() => setShowAddCustomerModal(true)}
                            onSetCustomerSearchQuery={(v) => setCustomerSearchQuery(v)}
                            onSelectCustomer={(c) => setSelectedCustomer(c)}
                            dueDate={dueDate || null}
                            onSetDueDate={(d) => setDueDate(d)}
                        />

                        <PaymentButton
                            isProcessing={isProcessing}
                            canProcess={canProcessPayment()}
                            error={getPaymentError()}
                            roundedTotal={roundedTotal}
                            onPress={handleProcessPayment}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <AddCustomerModal
                visible={showAddCustomerModal}
                onClose={() => setShowAddCustomerModal(false)}
                onAddCustomer={(customerData) => {
                    createAndSelectCustomer(customerData);
                    setShowAddCustomerModal(false);
                }}
            />
        </SafeAreaView>
    );
};

export default PaymentScreen;
