import React from 'react';
import { View } from 'react-native';
import FormInput from '../../FormInput';

interface Props {
    quantityPerUnit: string;
    quantity: string;
    minStock: string;
    maxStock: string;
    onChangeQuantityPerUnit: (v: string) => void;
    onChangeQuantity: (v: string) => void;
    onChangeMinStock: (v: string) => void;
    onChangeMaxStock: (v: string) => void;
}

const QuantityStockInputs: React.FC<Props> = ({
    quantityPerUnit,
    quantity,
    minStock,
    maxStock,
    onChangeQuantityPerUnit,
    onChangeQuantity,
    onChangeMinStock,
    onChangeMaxStock,
}) => {
    return (
        <>
            <View className='flex-row mb-4 gap-3'>
                <View className='flex-1'>
                    <FormInput
                        label='Quatity per Unit'
                        value={quantityPerUnit}
                        onChangeText={onChangeQuantityPerUnit}
                        placeholder='eg 500ml, 6pcs, 1 dozen etc.'
                    />
                </View>
                <View className='flex-1'>
                    <FormInput
                        label='Inventory Quantity'
                        value={quantity}
                        onChangeText={onChangeQuantity}
                        placeholder='0'
                        keyboardType='numeric'
                    />
                </View>
            </View>
            <View className='flex-row mb-4 gap-3'>
                <View className='flex-1'>
                    <FormInput
                        label='Min Stock alert'
                        value={minStock}
                        onChangeText={onChangeMinStock}
                        placeholder='0'
                        keyboardType='numeric'
                    />
                </View>
                <View className='flex-1'>
                    <FormInput
                        label='Max Stock alert'
                        value={maxStock}
                        onChangeText={onChangeMaxStock}
                        placeholder='100'
                        keyboardType='numeric'
                    />
                </View>
            </View>
        </>
    );
};

export default QuantityStockInputs;
