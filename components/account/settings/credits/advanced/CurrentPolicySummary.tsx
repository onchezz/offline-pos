import { Text, View } from 'react-native';
import { PolicySummaryItem } from './PolicySummaryItem';

interface CurrentPolicySummaryProps {
    approvalRequired: string;
    interestRate: string;
}

export const CurrentPolicySummary: React.FC<CurrentPolicySummaryProps> = ({
    approvalRequired,
    interestRate,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <Text className='text-base font-semibold mb-4'>Current Policy Summary</Text>

            <PolicySummaryItem label='Approval Required' value={approvalRequired} />

            <PolicySummaryItem label='Interest Rate' value={interestRate} />
        </View>
    );
};
