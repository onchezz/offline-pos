import React from 'react';
import { View } from 'react-native';
import FormInput from '../../FormInput';

interface Props {
    barcode: string;
    unit: string;
    onChangeBarcode: (v: string) => void;
    onChangeUnit: (v: string) => void;
}

const BarcodeUnitInputs: React.FC<Props> = ({ barcode, unit, onChangeBarcode, onChangeUnit }) => {
    return (
        <View className='flex-row mb-4 gap-3'>
            <View className='flex-1'>
                <FormInput
                    label='Barcode/SKU'
                    placeholder='Enter barcode or SKU'
                    value={barcode}
                    onChangeText={onChangeBarcode}
                />
            </View>

            <View className='flex-1'>
                <FormInput
                    label='Unit'
                    value={unit}
                    onChangeText={onChangeUnit}
                    placeholder='pcs, kg, liter, etc.'
                />
            </View>
        </View>
    );
};

export default BarcodeUnitInputs;
