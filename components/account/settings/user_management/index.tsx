import { RoleWithUserCount, User, UserFormData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RolesTab } from './roles';
import { UsersTab } from './users';

interface UserManagementProps {
    initialTab?: 'users' | 'roles';
    users: User[];
    roles: RoleWithUserCount[];
    onAddUser: (userData: UserFormData) => void;
    onEditUser: (userId: string, userData: UserFormData) => void;
    onDeleteUser: (userId: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
    initialTab = 'users',
    users,
    roles,
    onAddUser,
    onEditUser,
    onDeleteUser,
}) => {
    const [activeTab, setActiveTab] = useState<'users' | 'roles'>(initialTab);

    return (
        <View className='flex-1 px-4 py-4'>
            {/* Tabs */}
            <View className='flex-row mb-4 gap-2'>
                <TouchableOpacity
                    onPress={() => setActiveTab('users')}
                    className={`flex-1 py-3 rounded-lg items-center ${
                        activeTab === 'users' ? 'bg-black' : 'bg-white border border-gray-200'
                    }`}>
                    <View className='flex-row items-center'>
                        <Ionicons
                            name='people-outline'
                            size={18}
                            color={activeTab === 'users' ? '#fff' : '#000'}
                        />
                        <Text
                            className={`ml-2 font-semibold ${
                                activeTab === 'users' ? 'text-white' : 'text-black'
                            }`}>
                            Users
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setActiveTab('roles')}
                    className={`flex-1 py-3 rounded-lg items-center ${
                        activeTab === 'roles' ? 'bg-black' : 'bg-white border border-gray-200'
                    }`}>
                    <View className='flex-row items-center'>
                        <Ionicons
                            name='shield-checkmark-outline'
                            size={18}
                            color={activeTab === 'roles' ? '#fff' : '#000'}
                        />
                        <Text
                            className={`ml-2 font-semibold ${
                                activeTab === 'roles' ? 'text-white' : 'text-black'
                            }`}>
                            Roles
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Tab Content */}
            {activeTab === 'users' ? (
                <UsersTab
                    users={users}
                    onAddUser={onAddUser}
                    onEditUser={onEditUser}
                    onDeleteUser={onDeleteUser}
                    roles={roles}
                />
            ) : (
                <RolesTab
                    onAddRole={(roleData) => console.log('Add:', roleData)}
                    onEditRole={(id, roleData) => console.log('Edit:', id, roleData)}
                    roles={roles}
                />
            )}
        </View>
    );
};

export default UserManagement;
