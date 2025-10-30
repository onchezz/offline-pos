import { RoleWithUserCount } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

interface RoleCardProps {
    role: RoleWithUserCount;
    onEdit: (role: RoleWithUserCount) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({ role, onEdit }) => {
    const visiblePermissions = role.permissions.slice(0, 4);
    const remainingCount = role.permissions.length - 4;

    return (
        <View className='bg-white border border-gray-200 rounded-lg p-4 mb-3'>
            {/* Header */}
            <View className='flex-row items-center justify-between mb-3'>
                <View className='flex-row items-center flex-1'>
                    <Ionicons name='shield-checkmark-outline' size={20} color='#000' />
                    <Text className='font-semibold text-base ml-2'>{role.name}</Text>
                    <View className='bg-blue-100 px-2 py-1 rounded ml-2'>
                        <Text className='text-blue-700 text-xs font-medium'>
                            {role.userCount} users
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => onEdit(role)}>
                    <Ionicons name='create-outline' size={20} color='#000' />
                </TouchableOpacity>
            </View>

            {/* Permissions */}
            <View className='flex-row flex-wrap gap-2'>
                {visiblePermissions.map((permission, index) => (
                    <View key={index} className='bg-gray-100 px-3 py-1 rounded'>
                        <Text className='text-sm'>{permission}</Text>
                    </View>
                ))}
                {remainingCount > 0 && (
                    <View className='bg-gray-100 px-3 py-1 rounded'>
                        <Text className='text-sm font-medium'>+{remainingCount} more</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
