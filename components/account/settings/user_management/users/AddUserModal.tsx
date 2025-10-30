import { RoleWithUserCount, UserFormData } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

interface AddUserModalProps {
    visible: boolean;

    roles: RoleWithUserCount[];
    onClose: () => void;
    user: UserFormData | null;
    userId?: string | null;
    onSubmit?: (userData: UserFormData) => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
    visible,
    roles,

    onClose,
    user,
    onSubmit,
}) => {
    const [form, setForm] = useState<UserFormData>({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        role: user?.role || '',
    });
    const isEditMode = user !== null;

    const [showRoleList, setShowRoleList] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (isEditMode) {
            if (!user) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Cant update  Empty Staff',
                    position: 'bottom',
                });
                return;
            }
        }
        try {
            console.log('Selected business in AddUserModal:', user);

            setForm({
                fullName: user?.fullName || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                role: user?.role || '',
            });
        } catch (e) {
            console.error('AddUserModal load error', e);
        }
    }, [isEditMode, user]);

    const handleSubmit = () => {
        setSubmitting(true);
        setError(null);
    };

    return (
        <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
            <View className='flex-1 bg-black/50 justify-center items-center px-4'>
                <View className='bg-white rounded-lg w-full max-w-md'>
                    {/* Header */}
                    <View className='flex-row items-center justify-between p-4 border-b border-gray-200'>
                        <Text className='text-lg font-semibold'>
                            {isEditMode ? 'Edit User' : 'Add New User'}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name='close' size={24} color='#000' />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View className='p-4'>
                        {/* Full Name */}
                        <View className='mb-4'>
                            <Text className='text-sm font-medium mb-2'>Full Name</Text>
                            <TextInput
                                value={form.fullName}
                                onChangeText={(value) =>
                                    setForm((f) => ({ ...f, fullName: value }))
                                }
                                placeholder='Enter full name'
                                className='border border-gray-300 rounded-lg px-4 py-3 text-base'
                            />
                        </View>

                        {/* Email */}
                        <View className='mb-4'>
                            <Text className='text-sm font-medium mb-2'>Email</Text>
                            <TextInput
                                value={form.email}
                                onChangeText={(value) => setForm((f) => ({ ...f, email: value }))}
                                placeholder='Enter email address'
                                keyboardType='email-address'
                                className='border border-gray-300 rounded-lg px-4 py-3 text-base'
                            />
                        </View>

                        {/* Phone Number */}
                        <View className='mb-4'>
                            <Text className='text-sm font-medium mb-2'>Phone Number</Text>
                            <TextInput
                                value={form.phoneNumber}
                                onChangeText={(value) =>
                                    setForm((f) => ({ ...f, phoneNumber: value }))
                                }
                                placeholder='Enter phone number'
                                keyboardType='phone-pad'
                                className='border border-gray-300 rounded-lg px-4 py-3 text-base'
                            />
                        </View>

                        {/* Role */}
                        <View className='mb-6'>
                            <Text className='text-sm font-medium mb-2'>Role</Text>
                            <TouchableOpacity
                                onPress={() => setShowRoleList((v) => !v)}
                                className='border border-gray-300 rounded-lg px-4 py-3 flex-row items-center justify-between'>
                                <Text
                                    className={form.role ? 'text-base' : 'text-base text-gray-400'}>
                                    {form.role || 'Select role'}
                                </Text>
                                <Ionicons
                                    name={showRoleList ? 'chevron-up' : 'chevron-down'}
                                    size={20}
                                    color='#666'
                                />
                            </TouchableOpacity>

                            {showRoleList && (
                                <View className='mt-2 border border-gray-200 rounded-lg overflow-hidden'>
                                    {roles.length === 0 ? (
                                        <View className='p-3'>
                                            <Text className='text-sm text-gray-500'>
                                                No roles found
                                            </Text>
                                        </View>
                                    ) : (
                                        roles.map((r) => (
                                            <TouchableOpacity
                                                key={r.id}
                                                onPress={() => {
                                                    setForm((f) => ({ ...f, role: r.name }));
                                                    setShowRoleList(false);
                                                }}
                                                className='px-4 py-3'>
                                                <Text className='text-base'>{r.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Error */}
                        {error ? <Text className='text-sm text-red-600 mb-3'>{error}</Text> : null}

                        {/* Buttons */}
                        <View className='flex-row gap-3'>
                            <TouchableOpacity
                                onPress={onClose}
                                className='flex-1 bg-white border border-gray-300 rounded-lg py-3 items-center'>
                                <Text className='font-semibold text-base'>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={submitting}
                                className={`flex-1 ${submitting ? 'bg-gray-400' : 'bg-black'} rounded-lg py-3 items-center`}>
                                {submitting ? (
                                    <ActivityIndicator color='#fff' />
                                ) : (
                                    <Text className='font-semibold text-base text-white'>
                                        {isEditMode ? 'Update User' : 'Add User'}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};
