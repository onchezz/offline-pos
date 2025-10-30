import { Permission } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface RoleModalProps {
    visible: boolean;

    onClose: () => void;
    role: {
        name: string;
        permissions: Permission[];
    } | null;
    onSubmit?: (roleData: { name: string; permissions: Permission[] }) => void;
}

export const RoleModal: React.FC<RoleModalProps> = ({
    visible,

    onClose,
    role,
    onSubmit,
}) => {
    const [roleName, setRoleName] = useState(role?.name || '');
    const [permissions, setPermissions] = useState<Permission[]>(
        role?.permissions || [
            {
                id: '1',
                name: 'View Sales',
                description: 'Can view sales reports and transactions',
                enabled: false,
            },
            {
                id: '2',
                name: 'Process Sales',
                description: 'Can complete customer transactions',
                enabled: false,
            },
            {
                id: '3',
                name: 'Manage Inventory',
                description: 'Can add, edit, and remove inventory items',
                enabled: false,
            },
            {
                id: '4',
                name: 'View Inventory',
                description: 'Can view inventory levels and products',
                enabled: false,
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
                enabled: false,
            },
            {
                id: '7',
                name: 'Manage Users',
                description: 'Can add and remove users',
                enabled: false,
            },
        ],
    );
    const isEditMode = role !== null;
    useEffect(() => {
        if (role) {
            setRoleName(role.name);
            setPermissions(role.permissions);
        }
    }, [role]);

    const togglePermission = (id: string) => {
        setPermissions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
        );
    };

    const handleSubmit = () => {
        onSubmit?.({ name: roleName, permissions });
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
            <View className='flex-1 bg-black/50 justify-center items-center px-4'>
                <View className='bg-white rounded-lg w-full' style={{ maxHeight: '80%' }}>
                    {/* Header */}
                    <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
                        <Text className='text-lg font-semibold'>
                            {isEditMode ? 'Edit Role' : 'Add Role'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name='close' size={24} color='#000' />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ maxHeight: 500 }}>
                        <View className='p-4'>
                            {/* Role Name */}
                            <View className='mb-4'>
                                <Text className='text-sm font-medium mb-2'>Role Name</Text>
                                <TextInput
                                    value={roleName}
                                    onChangeText={setRoleName}
                                    placeholder='Enter role name'
                                    className='border border-gray-300 rounded-lg px-4 py-3 text-base'
                                />
                            </View>

                            {/* Permissions */}
                            <View className='mb-4'>
                                <Text className='text-sm font-medium mb-3'>Permissions</Text>
                                {permissions.map((permission) => (
                                    <View key={permission.id} className='flex-row items-start mb-4'>
                                        <Switch
                                            value={permission.enabled}
                                            onValueChange={() => togglePermission(permission.id)}
                                            trackColor={{ false: '#d1d5db', true: '#000' }}
                                            thumbColor='#fff'
                                        />
                                        <View className='flex-1 ml-3'>
                                            <Text className='font-medium text-base'>
                                                {permission.name}
                                            </Text>
                                            <Text className='text-gray-500 text-sm mt-1'>
                                                {permission.description}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Buttons */}
                    <View className='flex-row gap-3 p-4 border-t border-gray-200'>
                        <TouchableOpacity
                            onPress={onClose}
                            className='flex-1 bg-white border border-gray-300 rounded-lg py-3 items-center'>
                            <Text className='font-semibold text-base'>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            className='flex-1 bg-black rounded-lg py-3 items-center'>
                            <Text className='font-semibold text-base text-white'>
                                {isEditMode ? 'Update Role' : 'Add Role'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
