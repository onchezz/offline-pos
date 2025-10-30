import { Ionicons } from '@expo/vector-icons';
import { View, Text, Switch } from 'react-native';

interface InterestPenaltiesProps {
    enableInterestCharges: boolean;
    setEnableInterestCharges: (value: boolean) => void;
}

export const InterestPenalties: React.FC<InterestPenaltiesProps> = ({
    enableInterestCharges,
    setEnableInterestCharges,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <View className='flex-row items-center mb-4'>
                <Ionicons name='trending-up-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Interest & Penalties</Text>
            </View>

            {/* Enable Interest Charges */}
            <View className='flex-row items-start justify-between'>
                <View className='flex-1 mr-4'>
                    <Text className='text-sm font-semibold mb-1'>Enable Interest Charges</Text>
                    <Text className='text-sm text-gray-500'>
                        Charge interest on overdue payments
                    </Text>
                </View>
                <Switch
                    value={enableInterestCharges}
                    onValueChange={setEnableInterestCharges}
                    trackColor={{ false: '#d1d5db', true: '#000' }}
                    thumbColor='#fff'
                />
            </View>
        </View>
    );
};
