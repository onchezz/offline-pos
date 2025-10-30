import { RoleWithUserCount, User, UserFormData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AddUserModal } from './AddUserModal';
import { UserCard } from './UserCard';

interface UsersTabProps {
    users: User[];
    roles: RoleWithUserCount[];
    onAddUser: (userData: UserFormData) => void;
    onEditUser: (userId: string, userData: UserFormData) => void;
    onDeleteUser: (userId: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
    users: propUsers,
    roles,
    onAddUser,
    onEditUser,
    onDeleteUser,
}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserFormData | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    // show current signed in user info is optional — not needed for edit flow here

    const users = propUsers && propUsers.length > 0 ? propUsers : [];

    const handleEdit = (user: User) => {
        setSelectedUser({
            fullName: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber || '',
            role: user.role as string, // edit this
        });
        setSelectedUserId(user.id || null);
        setModalVisible(true);
    };
    const handleDelete = (userId: string) => {
        onDeleteUser?.(userId);
        console.log('Delete user:', userId);
    };

    const handleAddNew = () => {
        setSelectedUser(null);
        setSelectedUserId(null);
        setModalVisible(true);
    };

    const handleSubmit = (userData: UserFormData) => {
        if (selectedUserId) {
            onEditUser?.(selectedUserId, userData);
        } else {
            onAddUser?.(userData);
        }
    };

    return (
        <View className='flex-1'>
            {/* Header */}
            <View className='flex-row items-center justify-between mb-4'>
                <View>
                    <Text className='text-base font-semibold'>Team Members</Text>
                    <Text className='text-sm text-gray-500'>{users.length} users registered</Text>
                </View>
                <TouchableOpacity
                    onPress={handleAddNew}
                    className='bg-black rounded-lg px-4 py-2 flex-row items-center'>
                    <Ionicons name='person-add-outline' size={16} color='#fff' />
                    <Text className='text-white font-semibold ml-2'>Add User</Text>
                </TouchableOpacity>
            </View>

            {/* User List */}
            <ScrollView>
                {users.map((user) => (
                    <UserCard
                        key={user.externalId}
                        user={user}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </ScrollView>

            {/* Modal */}
            <AddUserModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                roles={roles}
                user={selectedUser}
                userId={selectedUserId}
                onSubmit={handleSubmit}
            />
        </View>
    );
};
