import React from 'react';
import { View } from 'react-native';
import FormInput from '../../FormInput';

interface Props {
    formData: any;
    onChangeName: (text: string) => void;
    onChangeBrand: (text: string) => void;
    required?: boolean;
    namePlaceholder?: string;
    brandPlaceholder?: string;
}

const ProductDetails: React.FC<Props> = ({
    formData,
    onChangeName,
    onChangeBrand,
    required,
    namePlaceholder,
    brandPlaceholder,
}) => {
    return (
        <View className='flex-row mb-4 gap-3'>
            <View style={{ flex: 2 }}>
                <FormInput
                    label='Product Name'
                    required={required}
                    value={formData.name}
                    onChangeText={onChangeName}
                    placeholder={namePlaceholder || 'Enter product name'}
                />
            </View>
            <View style={{ flex: 1.2 }}>
                <FormInput
                    label='Brand'
                    required={false}
                    value={formData.brand}
                    onChangeText={onChangeBrand}
                    placeholder={brandPlaceholder || 'Enter product brand'}
                />
            </View>
        </View>
    );
};

export default ProductDetails;
