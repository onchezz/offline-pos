import { AdvancedSettingsData } from '@/types';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ApprovalWorkflow } from './ApprovalWorkflow';
import { InterestPenalties } from './InterestPenalties';
import { CurrentPolicySummary } from './CurrentPolicySummary';
import { SaveAdvancedButton } from './SaveAdvancedButton';

interface AdvancedTabProps {
    onSave?: (data: AdvancedSettingsData) => void;
}

export const AdvancedTab: React.FC<AdvancedTabProps> = ({ onSave }) => {
    const [requireManagerApproval, setRequireManagerApproval] = useState(false);
    const [autoApprovalLimit, setAutoApprovalLimit] = useState('200');
    const [enableInterestCharges, setEnableInterestCharges] = useState(false);

    const handleSave = () => {
        const data: AdvancedSettingsData = {
            requireManagerApproval,
            autoApprovalLimit,
            enableInterestCharges,
        };
        onSave?.(data);
        console.log('Saving advanced settings:', data);
    };

    // Calculate summary values
    const getApprovalRequiredText = () => {
        if (!requireManagerApproval) return 'Not required';
        return `Auto-approve up to $${autoApprovalLimit}.00`;
    };

    const getInterestRateText = () => {
        return enableInterestCharges ? 'Interest charges enabled' : 'No interest charges';
    };

    return (
        <ScrollView className='flex-1'>
            <View className='mb-4'>
                <Text className='text-base font-semibold mb-1'>Advanced Settings</Text>
                <Text className='text-sm text-gray-500'>
                    Configure approval workflows and interest policies
                </Text>
            </View>

            <ApprovalWorkflow
                requireManagerApproval={requireManagerApproval}
                setRequireManagerApproval={setRequireManagerApproval}
                autoApprovalLimit={autoApprovalLimit}
                setAutoApprovalLimit={setAutoApprovalLimit}
            />

            <InterestPenalties
                enableInterestCharges={enableInterestCharges}
                setEnableInterestCharges={setEnableInterestCharges}
            />

            <CurrentPolicySummary
                approvalRequired={getApprovalRequiredText()}
                interestRate={getInterestRateText()}
            />

            <SaveAdvancedButton onPress={handleSave} />
        </ScrollView>
    );
};
