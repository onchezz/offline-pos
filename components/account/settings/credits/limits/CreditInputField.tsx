import { TextInput, Text, View } from 'react-native';

interface CreditInputFieldProps {
    label: string;
    description: string;
    value: string;
    onChangeText: (text: string) => void;
}

export const CreditInputField: React.FC<CreditInputFieldProps> = ({
    label,
    description,
    value,
    onChangeText,
}) => {
    return (
        <View className='mb-4'>
            <Text className='text-sm font-semibold mb-1'>{label}</Text>
            <Text className='text-sm text-gray-500 mb-2'>{description}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                keyboardType='numeric'
                className='border border-gray-300 rounded-lg px-4 py-3 text-base'
            />
        </View>
    );
};
