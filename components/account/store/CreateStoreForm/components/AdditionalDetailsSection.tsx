import React from 'react';
import { Text, View } from 'react-native';
import { CustomInput, CustomLabel, Selector } from './BasicUIComponents';
import { MANAGERS } from './constants';

interface AdditionalDetailsSectionProps {
    taxId: string;
    onTaxIdChange: (text: string) => void;
    managerId: string;
    selectedManager: (typeof MANAGERS)[0] | undefined;
    onManagerPress: () => void;
    receiptFooter: string;
    onReceiptFooterChange: (text: string) => void;
    description: string;
    onDescriptionChange: (text: string) => void;
}

export const AdditionalDetailsSection: React.FC<AdditionalDetailsSectionProps> = ({
    taxId,
    onTaxIdChange,
    managerId,
    selectedManager,
    onManagerPress,
    receiptFooter,
    onReceiptFooterChange,
    description,
    onDescriptionChange,
}) => (
    <View className='pt-5 pb-5'>
        <Text className='text-base font-semibold text-gray-900 mb-3'>Additional Details</Text>

        <View className='mb-3'>
            <CustomLabel>Tax ID</CustomLabel>
            <CustomInput value={taxId} onChangeText={onTaxIdChange} placeholder='VAT123456' />
        </View>

        <View className='mb-3'>
            <CustomLabel>Manager (optional)</CustomLabel>
            <Selector onPress={onManagerPress}>
                {selectedManager ? (
                    <View className='flex-row items-center gap-2 flex-1'>
                        <Text className='text-lg'>{selectedManager.avatar}</Text>
                        <Text className='text-sm text-gray-900'>{selectedManager.name}</Text>
                    </View>
                ) : (
                    <Text className='text-sm text-gray-400 flex-1'>Select manager</Text>
                )}
            </Selector>
        </View>

        <View className='mb-3'>
            <CustomLabel>Receipt Footer</CustomLabel>
            <CustomInput
                value={receiptFooter}
                onChangeText={onReceiptFooterChange}
                placeholder='Thank you for shopping with us!'
                numberOfLines={4}
            />
        </View>

        <View className='mb-3'>
            <CustomLabel>Description (optional)</CustomLabel>
            <CustomInput
                value={description}
                onChangeText={onDescriptionChange}
                placeholder='Brief description of your store'
                numberOfLines={4}
            />
        </View>
    </View>
);
