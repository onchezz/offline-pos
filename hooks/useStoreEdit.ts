import { storeService } from '@/db/services/storeService';
import { StoreData } from '@/types';
import { useCallback, useEffect, useState } from 'react';

interface EditableStoreData {
    name: string;
    type: string;
    phone: string;
    email: string;
    address: string;
    description: string;
    weekdayHours: string;
    weekendHours: string;
    weekdayOpen?: string;
    weekdayClose?: string;
    weekendOpen?: string;
    weekendClose?: string;
    taxId: string;
    receiptFooter: string;
    statusActive: boolean;
    wholesaleEnabled?: boolean;
    logoEmoji?: string;
    establishedYear?: string;
    countryCode?: string;
    currency?: string;
    timezone?: string;
    managerId?: string;
}

export const useStoreEdit = (initialData: StoreData, externalId?: string) => {
    const [isEditing, setIsEditing] = useState(false);
    const [storeData, setStoreData] = useState<StoreData>(initialData);
    const joinHours = (a?: string, b?: string) => `${a ?? ''} ${b ?? ''}`.trim();
    const [editedData, setEditedData] = useState<EditableStoreData>({
        name: initialData.name,
        type: initialData.type ?? '',
        phone: initialData.phone ?? '',
        email: initialData.email ?? '',
        address: initialData.address ?? '',
        description: initialData.description ?? '',
        // Some store data shapes use separate open/close fields; join them for display
        weekdayHours: joinHours(initialData.weekdayOpen, initialData.weekdayClose),
        weekendHours: joinHours(initialData.weekendOpen, initialData.weekendClose),
        weekdayOpen: initialData.weekdayOpen || '',
        weekdayClose: initialData.weekdayClose || '',
        weekendOpen: initialData.weekendOpen || '',
        weekendClose: initialData.weekendClose || '',
        taxId: initialData.taxId ?? '',
        receiptFooter: initialData.receiptFooter ?? '',
        statusActive: (initialData.status || 'active') === 'active',
        wholesaleEnabled: !!initialData.wholesaleEnabled,
        logoEmoji: initialData.logoEmoji || '',
        establishedYear: initialData.establishedYear || '',
        countryCode: initialData.countryCode || '',
        currency: initialData.currency || '',
        timezone: initialData.timezone || '',
        managerId: initialData.managerId || '',
    });

    // Reset edited data when initial data changes
    useEffect(() => {
        setStoreData(initialData);
        setEditedData({
            name: initialData.name,
            type: initialData.type ?? '',
            phone: initialData.phone ?? '',
            email: initialData.email ?? '',
            address: initialData.address ?? '',
            description: initialData.description ?? '',
            weekdayHours: joinHours(initialData.weekdayOpen, initialData.weekdayClose),
            weekendHours: joinHours(initialData.weekendOpen, initialData.weekendClose),
            weekdayOpen: initialData.weekdayOpen || '',
            weekdayClose: initialData.weekdayClose || '',
            weekendOpen: initialData.weekendOpen || '',
            weekendClose: initialData.weekendClose || '',
            taxId: initialData.taxId ?? '',
            receiptFooter: initialData.receiptFooter ?? '',
            statusActive: (initialData.status || 'active') === 'active',
            wholesaleEnabled: !!initialData.wholesaleEnabled,
            logoEmoji: initialData.logoEmoji || '',
            establishedYear: initialData.establishedYear || '',
            countryCode: initialData.countryCode || '',
            currency: initialData.currency || '',
            timezone: initialData.timezone || '',
            managerId: initialData.managerId || '',
        });
    }, [initialData]);

    const handleEdit = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setEditedData({
            name: storeData.name ?? '',
            type: storeData.type ?? '',
            phone: storeData.phone ?? '',
            email: storeData.email ?? '',
            address: storeData.address ?? '',
            description: storeData.description ?? '',
            weekdayHours: `${storeData.weekdayOpen ?? ''} ${storeData.weekdayClose ?? ''}`.trim(),
            weekendHours: `${storeData.weekendOpen ?? ''} ${storeData.weekendClose ?? ''}`.trim(),
            weekdayOpen: storeData.weekdayOpen ?? '',
            weekdayClose: storeData.weekdayClose ?? '',
            weekendOpen: storeData.weekendOpen ?? '',
            weekendClose: storeData.weekendClose ?? '',
            taxId: storeData.taxId ?? '',
            receiptFooter: storeData.receiptFooter ?? '',
            statusActive: (storeData.status || 'active') === 'active',
            wholesaleEnabled: !!storeData.wholesaleEnabled,
            logoEmoji: (storeData as any).logoUrl || (storeData as any).logoEmoji || '',
        });
    }, [storeData]);

    const handleSaveChanges = useCallback(async () => {
        console.log('💾 Saving changes for externalId:', externalId, editedData);
        try {
            // Find the store by externalId and update it in the DB
            if (externalId) {
                const found = await storeService.findByExternalId(externalId);
                if (found) {
                    await storeService.updateStore(found.id, {
                        name: editedData.name,
                        type: editedData.type,
                        phone: editedData.phone,
                        email: editedData.email,
                        address: editedData.address,
                        description: editedData.description,
                        weekdayHours: joinHours(editedData.weekdayOpen, editedData.weekdayClose),
                        weekendHours: joinHours(editedData.weekendOpen, editedData.weekendClose),
                        establishedYear: editedData.establishedYear,
                        currency: editedData.currency,
                        timezone: editedData.timezone,
                        managerId: editedData.managerId,
                        taxId: editedData.taxId,
                        receiptFooter: editedData.receiptFooter,
                        logoUrl: editedData.logoEmoji,
                        status: editedData.statusActive ? 'active' : 'inactive',
                        wholesaleEnabled: !!editedData.wholesaleEnabled,
                    });
                }
            }

            // Update local state
            setStoreData({
                ...storeData,
                name: editedData.name,
                type: editedData.type,
                phone: editedData.phone,
                email: editedData.email,
                address: editedData.address,
                description: editedData.description,
                // map the freeform hours text into weekdayOpen/weekendOpen so components can read something
                weekdayOpen: editedData.weekdayOpen || editedData.weekdayHours,
                weekendOpen: editedData.weekendOpen || editedData.weekendHours,
                weekdayClose: editedData.weekdayClose || '',
                weekendClose: editedData.weekendClose || '',
                taxId: editedData.taxId,
                receiptFooter: editedData.receiptFooter,
                establishedYear: editedData.establishedYear,
                currency: editedData.currency,
                timezone: editedData.timezone,
                managerId: editedData.managerId,
                status: editedData.statusActive ? 'active' : storeData.status,
                wholesaleEnabled: !!editedData.wholesaleEnabled,
            });
            setIsEditing(false);
            console.log('✅ Changes saved successfully');
            return true;
        } catch (error) {
            console.error('❌ Error saving changes:', error);
            return false;
        }
    }, [externalId, editedData, storeData]);

    const updateField = useCallback((field: keyof EditableStoreData, value: string | boolean) => {
        setEditedData((prev) => ({ ...prev, [field]: value }) as EditableStoreData);
    }, []);

    return {
        isEditing,
        storeData,
        editedData,
        setIsEditing,
        handleEdit,
        handleCancel,
        handleSaveChanges,
        updateField,
    };
};
