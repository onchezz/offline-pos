import React from 'react';
import { View } from 'react-native';
import FormInput from '../../FormInput';

interface Props {
    cost: string;
    wholeSalePrice: string;
    price: string;
    onChangeCost: (v: string) => void;
    onChangeWholeSale: (v: string) => void;
    onChangePrice: (v: string) => void;
}

const PriceInputs: React.FC<Props> = ({
    cost,
    wholeSalePrice,
    price,
    onChangeCost,
    onChangeWholeSale,
    onChangePrice,
}) => {
    return (
        <View className='flex-row mb-4 gap-3'>
            <View className='flex-1'>
                <FormInput
                    label='Cost Price'
                    placeholder='0.00'
                    keyboardType='decimal-pad'
                    value={cost}
                    onChangeText={onChangeCost}
                />
            </View>
            <View className='flex-1'>
                <FormInput
                    label='Wholesale Price'
                    placeholder='0.00'
                    keyboardType='decimal-pad'
                    value={wholeSalePrice}
                    onChangeText={onChangeWholeSale}
                />
            </View>
            <View className='flex-1'>
                <FormInput
                    label='retail Price'
                    required={true}
                    placeholder='0.00'
                    keyboardType='decimal-pad'
                    value={price}
                    onChangeText={onChangePrice}
                />
            </View>
        </View>
    );
};

export default PriceInputs;
