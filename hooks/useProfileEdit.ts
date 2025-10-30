import { updateUserByExternalId } from '@/db/services/userService';
import { UserProfileData } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export const useProfileEdit = (initialData: UserProfileData, externalId?: string) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(initialData);

    // Reset edited data when initial data changes
    useEffect(() => {
        setEditedData(initialData);
    }, [initialData]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setEditedData(initialData);
    }, [initialData]);

    const handleSaveChanges = useCallback(async () => {
        console.log('💾 Saving changes for externalId:', externalId, editedData);
        try {
            if (externalId) {
                // Map UserProfileData to DB fields
                const patch: Partial<{ name: string; email: string; phone: string }> = {
                    name: `${editedData.firstName}`.trim(),
                    email: editedData.email,
                    phone: editedData.phone,
                };
                await updateUserByExternalId(externalId, patch);
            }

            setIsEditing(false);
            console.log('✅ Changes saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            return false;
        }
    }, [externalId, editedData]);

    const updateField = useCallback(
        (field: keyof UserProfileData, value: string | number | boolean | string[] | undefined) => {
            setEditedData((prev) => ({ ...prev, [field]: value }) as UserProfileData);
        },
        [],
    );

    return {
        isEditing,
        editedData,
        setIsEditing,
        handleEdit,
        handleCancel,
        handleSaveChanges,
        updateField,
    };
};
