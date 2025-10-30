import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function HelpSupport() {
    return (
        <View className='bg-white rounded-lg border border-gray-200 p-4'>
            {/* Header */}
            <View className='flex-row items-center mb-4'>
                <Ionicons name='help-circle-outline' size={20} color='#000' />
                <Text className='text-base font-semibold ml-2'>Help & Support</Text>
            </View>

            {/* User Guide */}
            <TouchableOpacity className='bg-gray-50 rounded-lg px-4 py-3 mb-3 flex-row items-center'>
                <Ionicons name='book-outline' size={20} color='#000' />
                <Text className='font-medium text-base ml-3'>User Guide</Text>
            </TouchableOpacity>

            {/* Contact Support */}
            <TouchableOpacity className='bg-gray-50 rounded-lg px-4 py-3 mb-3 flex-row items-center'>
                <Ionicons name='chatbox-outline' size={20} color='#000' />
                <Text className='font-medium text-base ml-3'>Contact Support</Text>
            </TouchableOpacity>

            {/* App Version */}
            <TouchableOpacity className='bg-gray-50 rounded-lg px-4 py-3 flex-row items-center'>
                <Ionicons name='information-circle-outline' size={20} color='#000' />
                <Text className='font-medium text-base ml-3'>App Version: 1.0.0</Text>
            </TouchableOpacity>
        </View>
    );
}
