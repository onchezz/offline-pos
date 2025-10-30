import { View, Text, Switch } from 'react-native';

interface ReceiptContentProps {
    includeStoreHeader: boolean;
    setIncludeStoreHeader: (value: boolean) => void;
    includeFooterMessage: boolean;
    setIncludeFooterMessage: (value: boolean) => void;
}

export const ReceiptContent: React.FC<ReceiptContentProps> = ({
    includeStoreHeader,
    setIncludeStoreHeader,
    includeFooterMessage,
    setIncludeFooterMessage,
}) => {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4 mb-4'>
            <Text className='text-base font-semibold mb-4'>Receipt Content</Text>

            {/* Include Store Header */}
            <View className='mb-4'>
                <View className='flex-row items-start justify-between'>
                    <View className='flex-1 mr-4'>
                        <Text className='text-sm font-semibold mb-1'>Include Store Header</Text>
                        <Text className='text-sm text-gray-500'>
                            Show store name and contact information
                        </Text>
                    </View>
                    <Switch
                        value={includeStoreHeader}
                        onValueChange={setIncludeStoreHeader}
                        trackColor={{ false: '#d1d5db', true: '#000' }}
                        thumbColor='#fff'
                    />
                </View>
            </View>

            {/* Include Footer Message */}
            <View>
                <View className='flex-row items-start justify-between'>
                    <View className='flex-1 mr-4'>
                        <Text className='text-sm font-semibold mb-1'>Include Footer Message</Text>
                        <Text className='text-sm text-gray-500'>
                            Show thank you message and timestamp
                        </Text>
                    </View>
                    <Switch
                        value={includeFooterMessage}
                        onValueChange={setIncludeFooterMessage}
                        trackColor={{ false: '#d1d5db', true: '#000' }}
                        thumbColor='#fff'
                    />
                </View>
            </View>
        </View>
    );
};
