import { router } from 'expo-router';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BasicInfoCard } from '@/components/account/profile/BasicInfoCard';
import { ContactInfoCard } from '@/components/account/profile/ContactInfoCard';
import { EditModeActions } from '@/components/account/profile/EditModeActions';
import { ProfileHeader } from '@/components/account/profile/ProfileHeader';
import { WorkInfoCard } from '@/components/account/profile/WorkInfoCard';
import useProfile from '@/hooks/useProfile';
import { useProfileEdit } from '@/hooks/useProfileEdit';
import { UserProfileData } from '@/types';

const MyProfileScreen: React.FC = () => {
    const { profile, externalId, availableRoles, updateProfile } = useProfile();

    const defaultProfile: UserProfileData = {
        id: '',
        firstName: '',
        lastName: '',
        role: '',
        email: '',
        phone: '',
        emergencyContact: '',
        joinDate: '',
        permissions: [],
    };

    const {
        isEditing,
        editedData,
        handleEdit,
        handleCancel,
        handleSaveChanges,
        updateField,
        setIsEditing,
    } = useProfileEdit(profile || defaultProfile, externalId || undefined);

    const handleSave = async () => {
        const ok = await updateProfile(editedData);
        if (ok) {
            setIsEditing(false);
        }
        return ok;
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <ProfileHeader isEditing={isEditing} onBack={handleBack} onEdit={handleEdit} />

                <View className='p-4'>
                    <BasicInfoCard
                        firstName={editedData.firstName}
                        lastName={editedData.lastName}
                        role={editedData.role}
                        availableRoles={availableRoles?.map((r) => r.name) || []}
                        isEditing={isEditing}
                        onFirstNameChange={(text) => updateField('firstName', text)}
                        onLastNameChange={(text) => updateField('lastName', text)}
                        onRoleChange={(text) => updateField('role', text)}
                    />

                    <ContactInfoCard
                        phone={editedData.phone}
                        email={editedData.email}
                        emergencyContact={editedData.phone}
                        isEditing={isEditing}
                        onPhoneChange={(text) => updateField('phone', text)}
                        onEmailChange={(text) => updateField('email', text)}
                        onEmergencyContactChange={(text) => updateField('emergencyContact', text)}
                    />

                    <WorkInfoCard
                        joinDate={editedData.joinDate}
                        permissions={editedData.permissions}
                    />

                    {isEditing && <EditModeActions onSave={handleSave} onCancel={handleCancel} />}

                    {/* Extra padding for bottom nav */}
                    <View className='h-20' />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default MyProfileScreen;
