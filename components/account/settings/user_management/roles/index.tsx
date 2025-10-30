import { Permission, RoleWithUserCount } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { RoleCard } from './RoleCard';
import { RoleModal } from './RoleModal';

interface RolesTabProps {
    roles: RoleWithUserCount[];
    onAddRole?: (roleData: { name: string; permissions: Permission[] }) => void;
    onEditRole?: (roleId: number, roleData: { name: string; permissions: Permission[] }) => void;
}

export const RolesTab: React.FC<RolesTabProps> = ({ onAddRole, onEditRole, roles }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState<{
        id?: number;
        name: string;
        permissions: Permission[];
    } | null>(null);

    useEffect(() => {}, [roles]);

    const handleEdit = (role: RoleWithUserCount) => {
        // Convert role permissions to Permission objects
        const permissionObjects: Permission[] = [
            {
                id: '1',
                name: 'View Sales',
                description: 'Can view sales reports and transactions',
                enabled: role.permissions.includes('View Sales'),
            },
            {
                id: '2',
                name: 'Process Sales',
                description: 'Can complete customer transactions',
                enabled: role.permissions.includes('Process Sales'),
            },
            {
                id: '3',
                name: 'Manage Inventory',
                description: 'Can add, edit, and remove inventory items',
                enabled: role.permissions.includes('Manage Inventory'),
            },
            {
                id: '4',
                name: 'View Inventory',
                description: 'Can view inventory levels and products',
                enabled: role.permissions.includes('View Inventory'),
            },
            {
                id: '5',
                name: 'Manage Credit',
                description: 'Can approve and manage customer credit',
                enabled: false,
            },
            {
                id: '6',
                name: 'View Credit',
                description: 'Can view customer credit information',
                enabled: role.permissions.includes('View Credit'),
            },
            {
                id: '7',
                name: 'Manage Users',
                description: 'Can add and remove users',
                enabled: false,
            },
        ];

        setSelectedRole({
            id: role.id,
            name: role.name,
            permissions: permissionObjects,
        });
        setModalVisible(true);
    };

    const handleAddNew = () => {
        setSelectedRole(null);
        setModalVisible(true);
    };

    const handleSubmit = (roleData: { name: string; permissions: Permission[] }) => {};

    return (
        <View className='flex-1'>
            {/* Header */}
            <View className='flex-row items-center justify-between mb-4'>
                <View>
                    <Text className='text-base font-semibold'>User Roles & Permissions</Text>
                    <Text className='text-sm text-gray-500'>
                        Manage roles and their permissions
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handleAddNew}
                    className='bg-white border border-gray-200 rounded-lg px-3 py-2 flex-row items-center'>
                    <Ionicons name='settings-outline' size={16} color='#000' />
                    <Text className='font-semibold ml-2'>Add Role</Text>
                </TouchableOpacity>
            </View>

            {/* Role List */}
            <ScrollView>
                {roles && roles.length > 0 ? (
                    roles.map((role) => <RoleCard key={role.id} role={role} onEdit={handleEdit} />)
                ) : (
                    <View className='p-4'>
                        <Text className='text-sm text-gray-500'>
                            No roles configured for this business.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal */}
            <RoleModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                role={selectedRole}
                onSubmit={handleSubmit}
            />
        </View>
    );
};
