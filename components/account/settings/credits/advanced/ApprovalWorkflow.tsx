import { Ionicons } from '@expo/vector-icons';
import { View, Text, Switch, TextInput } from 'react-native';

interface ApprovalWorkflowProps {
    requireManagerApproval: boolean;
    setRequireManagerApproval: (value: boolean) => void;
    autoApprovalLimit: string;
    setAutoApprovalLimit: (value: string) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
    requireManagerApproval,
    setRequireManagerApproval,
    autoApprovalLimit,
    setAutoApprovalLimit,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <View className='flex-row items-center mb-4'>
                <Ionicons name='checkmark-circle-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Approval Workflow</Text>
            </View>

            {/* Require Manager Approval */}
            <View className='mb-4'>
                <View className='flex-row items-start justify-between mb-2'>
                    <View className='flex-1 mr-4'>
                        <Text className='text-sm font-semibold mb-1'>Require Manager Approval</Text>
                        <Text className='text-sm text-gray-500'>
                            All credit transactions need manager approval
                        </Text>
                    </View>
                    <Switch
                        value={requireManagerApproval}
                        onValueChange={setRequireManagerApproval}
                        trackColor={{ false: '#d1d5db', true: '#000' }}
                        thumbColor='#fff'
                    />
                </View>
            </View>

            {/* Auto-Approval Limit */}
            <View>
                <Text className='text-sm font-semibold mb-1'>Auto-Approval Limit ($)</Text>
                <Text className='text-sm text-gray-500 mb-2'>
                    Transactions below this amount are automatically approved
                </Text>
                <TextInput
                    value={autoApprovalLimit}
                    onChangeText={setAutoApprovalLimit}
                    keyboardType='numeric'
                    className='border border-gray-300 rounded-lg px-4 py-3 text-base'
                />
            </View>
        </View>
    );
};
