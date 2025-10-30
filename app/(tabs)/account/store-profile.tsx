import { EditModeActions } from '@/components/account/profile/EditModeActions';
import {
    AdditionalDetailsSection,
    BasicInfoSection,
    ContactSection,
    OperatingHoursSection,
    StoreSettingsSection,
    StoreTypeModal,
} from '@/components/account/store/CreateStoreForm/components';
import { DropdownModal } from '@/components/account/store/CreateStoreForm/components/DropdownModal';
import { EmojiPickerModal } from '@/components/account/store/CreateStoreForm/components/EmojiPickerModal';
import { ManagerDropdownModal } from '@/components/account/store/CreateStoreForm/components/ManagerDropdownModal';
import {
    ALL_EMOJIS,
    COUNTRY_CODES,
    STORE_TYPES,
    TIMEZONES,
} from '@/components/account/store/CreateStoreForm/components/constants';
import { StoreHeader } from '@/components/account/store/StoreHeader';
import { initialStoreData } from '@/constants/account';
import { storeService } from '@/db/services/storeService';
import { useStoreEdit } from '@/hooks/useStoreEdit';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StoreInformationScreen: React.FC = () => {
    const params = useLocalSearchParams();
    const externalId = params?.externalId as string;

    const [initialData, setInitialData] = useState(initialStoreData);

    const {
        isEditing,
        editedData,
        storeData,
        setIsEditing,
        handleEdit,
        handleCancel,
        handleSaveChanges,
        updateField,
    } = useStoreEdit(initialData, externalId);

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showStoreTypePicker, setShowStoreTypePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState<{
        field: 'weekdayOpen' | 'weekdayClose' | 'weekendOpen' | 'weekendClose' | null;
    }>({ field: null });
    const [showDropdown, setShowDropdown] = useState<{
        field: 'currency' | 'timezone' | 'countryCode' | 'year' | 'manager' | null;
    }>({ field: null });

    const years = React.useMemo(() => {
        const y: string[] = [];
        const now = new Date().getFullYear();
        for (let i = now; i >= 1900; i--) y.push(String(i));
        return y;
    }, []);

    const selectedStoreType =
        STORE_TYPES.find((t) => t.label === editedData.type) || STORE_TYPES[0];

    useEffect(() => {
        if (params?.edit === 'true') {
            setIsEditing(true);
        }
    }, [params?.edit, setIsEditing]);

    // Fetch store data when externalId changes and populate the form
    useEffect(() => {
        if (!externalId) return;
        (async () => {
            try {
                const s = await storeService.findByExternalId(externalId);
                if (s) {
                    setInitialData({
                        name: s.name || '',
                        type: s.type || '',
                        establishedYear: s.establishedYear || '',
                        phone: s.phone || '',
                        email: s.email || '',
                        address: s.address || '',
                        description: s.description || '',
                        receiptFooter: s.receiptFooter || '',
                        currency: s.currency || '',
                        timezone: s.timezone || '',
                        wholesaleEnabled: !!s.wholesaleEnabled,
                        logoEmoji: s.logoUrl || (s as any).logoEmoji || '',
                        weekdayOpen: s.weekdayHours || '',
                        weekendOpen: s.weekendHours || '',
                        taxId: s.taxId || '',
                    });
                }
            } catch {
                console.error('Error fetching store by externalId');
            }
        })();
    }, [externalId]);

    const handleBack = () => {
        router.back();
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <StoreHeader isEditing={isEditing} onBack={handleBack} onEdit={handleEdit} />

                <View className='p-4'>
                    <BasicInfoSection
                        logoEmoji={editedData.logoEmoji || (storeData.receiptFooter ? '🏬' : '🏪')}
                        onEmojiPress={() => setShowEmojiPicker(true)}
                        name={editedData.name}
                        onNameChange={(text) => updateField('name', text)}
                        type={editedData.type}
                        onTypePress={() => setShowStoreTypePicker(true)}
                        selectedStoreType={selectedStoreType}
                        establishedYear={
                            editedData.establishedYear || storeData.establishedYear || ''
                        }
                        onYearPress={() => setShowDropdown({ field: 'year' })}
                        statusActive={editedData.statusActive}
                        onStatusChange={(active) =>
                            updateField('statusActive' as any, active as any)
                        }
                    />

                    <ContactSection
                        address={editedData.address}
                        onAddressChange={(text) => updateField('address', text)}
                        countryCode={editedData.countryCode || storeData.countryCode || '+254'}
                        selectedCountry={{
                            code: editedData.countryCode || storeData.countryCode || '+254',
                            label: '',
                            flag: '🇰🇪',
                        }}
                        onCountryCodePress={() => setShowDropdown({ field: 'countryCode' })}
                        phone={editedData.phone}
                        onPhoneChange={(text) => updateField('phone', text)}
                        email={editedData.email}
                        onEmailChange={(text) => updateField('email', text)}
                    />

                    <OperatingHoursSection
                        weekdayOpen={editedData.weekdayOpen || storeData.weekdayOpen || ''}
                        weekdayClose={editedData.weekdayClose || ''}
                        weekendOpen={editedData.weekendOpen || storeData.weekendOpen || ''}
                        weekendClose={editedData.weekendClose || ''}
                        formatTimeDisplay={(t) => t}
                        onTimePress={(field) => setShowTimePicker({ field })}
                    />

                    <StoreSettingsSection
                        currency={editedData.currency || storeData.currency || 'Kes'}
                        onCurrencyPress={() => setShowDropdown({ field: 'currency' })}
                        timezone={editedData.timezone || storeData.timezone || 'Africa/Nairobi'}
                        onTimezonePress={() => setShowDropdown({ field: 'timezone' })}
                        wholesaleEnabled={!!editedData.wholesaleEnabled}
                        onToggleWholesale={(v) => updateField('wholesaleEnabled', v)}
                    />

                    <AdditionalDetailsSection
                        taxId={editedData.taxId}
                        onTaxIdChange={(text) => updateField('taxId', text)}
                        managerId={''}
                        selectedManager={undefined}
                        onManagerPress={() => {}}
                        receiptFooter={editedData.receiptFooter}
                        onReceiptFooterChange={(text) => updateField('receiptFooter', text)}
                        description={editedData.description}
                        onDescriptionChange={(text) => updateField('description', text)}
                    />

                    {isEditing && (
                        <EditModeActions onSave={handleSaveChanges} onCancel={handleCancel} />
                    )}

                    {/* Modals used to edit fields in-place (parity with CreateStoreForm) */}
                    <EmojiPickerModal
                        visible={showEmojiPicker}
                        onClose={() => setShowEmojiPicker(false)}
                        value={editedData.logoEmoji || ''}
                        onSelect={(logoEmoji: string) => {
                            updateField('logoEmoji', logoEmoji);
                            setShowEmojiPicker(false);
                        }}
                        suggestedEmojis={selectedStoreType.suggestedLogos}
                        allEmojis={ALL_EMOJIS}
                    />

                    <StoreTypeModal
                        visible={showStoreTypePicker}
                        onClose={() => setShowStoreTypePicker(false)}
                        value={editedData.type}
                        onSelect={(type) => {
                            const storeType = STORE_TYPES.find((t) => t.label === type);
                            if (storeType) {
                                updateField('type', type);
                                updateField('logoEmoji', storeType.suggestedLogos[0] || '');
                            }
                            setShowStoreTypePicker(false);
                        }}
                        options={STORE_TYPES}
                    />

                    {showDropdown.field === 'timezone' && (
                        <DropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            title='Select Timezone'
                            value={editedData.timezone || storeData.timezone || ''}
                            options={TIMEZONES}
                            onSelect={(timezone: string) => {
                                updateField('timezone', timezone);
                                setShowDropdown({ field: null });
                            }}
                        />
                    )}

                    {showDropdown.field === 'countryCode' && (
                        <DropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            title='Select Country Code'
                            value={editedData.countryCode || storeData.countryCode || '+254'}
                            options={COUNTRY_CODES.map((c) => c.code)}
                            displayOptions={COUNTRY_CODES.map(
                                (c) => `${c.flag} ${c.code} ${c.label}`,
                            )}
                            onSelect={(countryCode: string) => {
                                updateField('countryCode', countryCode);
                                setShowDropdown({ field: null });
                            }}
                        />
                    )}

                    {showDropdown.field === 'year' && (
                        <DropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            title='Select Year'
                            value={editedData.establishedYear || storeData.establishedYear || ''}
                            options={years}
                            onSelect={(establishedYear: string) => {
                                updateField('establishedYear', establishedYear);
                                setShowDropdown({ field: null });
                            }}
                        />
                    )}

                    {showDropdown.field === 'manager' && (
                        <ManagerDropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            value={editedData.managerId || ''}
                            onSelect={(managerId: string) => {
                                updateField('managerId', managerId);
                                setShowDropdown({ field: null });
                            }}
                            managers={[]}
                        />
                    )}

                    {/* Extra padding for bottom nav */}
                    <View className='h-20' />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default StoreInformationScreen;
