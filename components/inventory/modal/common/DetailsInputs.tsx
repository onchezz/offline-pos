import React from 'react';
import { View } from 'react-native';
import FormInput from '../../FormInput';

interface Props {
    location: string;
    description: string;
    onChangeLocation: (v: string) => void;
    onChangeDescription: (v: string) => void;
}

const DetailsInputs: React.FC<Props> = ({
    location,
    description,
    onChangeLocation,
    onChangeDescription,
}) => {
    return (
        <>
            <View className='mb-4'>
                <FormInput
                    label='Location'
                    value={location}
                    onChangeText={onChangeLocation}
                    placeholder='Shelf, Aisle, etc.'
                />
            </View>

            <View className='mb-8'>
                <FormInput
                    label='Description (optional)'
                    value={description}
                    onChangeText={onChangeDescription}
                    placeholder='Product description (optional)'
                    multiline
                    numberOfLines={3}
                    textAlignVertical='top'
                />
            </View>
        </>
    );
};

export default DetailsInputs;
