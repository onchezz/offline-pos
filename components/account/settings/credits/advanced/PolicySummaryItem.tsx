import { View, Text } from 'react-native';

interface PolicySummaryItemProps {
    label: string;
    value: string;
}

export const PolicySummaryItem: React.FC<PolicySummaryItemProps> = ({ label, value }) => {
    return (
        <View className='mb-3'>
            <Text className='text-sm text-gray-500 mb-1'>{label}</Text>
            <Text className='text-base font-medium'>{value}</Text>
        </View>
    );
};
