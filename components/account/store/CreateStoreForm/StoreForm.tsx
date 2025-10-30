import React, { useMemo, useState } from 'react';
import { Alert, ScrollView, StatusBar, Text, View } from 'react-native';

import {
    AdditionalDetailsSection,
    BasicInfoSection,
    ContactSection,
    CustomButton,
    OperatingHoursSection,
    StoreSettingsSection,
    StoreTypeModal,
    TimePickerModal,
} from './components';
import { DropdownModal } from './components/DropdownModal';
import { EmojiPickerModal } from './components/EmojiPickerModal';
import { ManagerDropdownModal } from './components/ManagerDropdownModal';

import { useBusiness } from '@/contexts/BusinessContext';
import { storeService } from '@/db/services/storeService';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import User from '@/db/models/users';
import {
    ALL_EMOJIS,
    COUNTRY_CODES,
    CURRENCIES,
    MANAGERS,
    STORE_TYPES,
    TIMEZONES,
} from './constants';
import { StoreData } from './types';

interface StoreFormProps {
    initial?: Partial<StoreData>;
    // optional handlers when embedding the form in another flow (e.g., signup)
    onCancel?: () => void;
    onCreate?: (data: StoreData) => Promise<void> | void;
    createDirect?: boolean;
    showFooterButtons?: boolean;
    users: User[];
}

export default function StoreForm({
    initial,
    onCancel,
    onCreate,
    createDirect = true,
    showFooterButtons = true,
    users,
}: StoreFormProps) {
    const { selectedBusiness } = useBusiness();
    // Initialize complete form data with required fields and defaults
    const initialFormData: Required<StoreData> = {
        name: initial?.name || '',
        type: initial?.type || STORE_TYPES[0].label,
        logoEmoji: initial?.logoEmoji || STORE_TYPES[0].suggestedLogos[0],
        address: initial?.address || '',
        countryCode: initial?.countryCode || COUNTRY_CODES[0].code,
        phone: initial?.phone || '',
        email: initial?.email || '',
        description: initial?.description || '',
        weekdayOpen: initial?.weekdayOpen || '08:00',
        weekdayClose: initial?.weekdayClose || '18:00',
        weekendOpen: initial?.weekendOpen || '09:00',
        weekendClose: initial?.weekendClose || '17:00',
        taxId: initial?.taxId || '',
        establishedYear: initial?.establishedYear || '',
        managerId: initial?.managerId || '',
        currency: initial?.currency || CURRENCIES[0],
        timezone: initial?.timezone || TIMEZONES[0],
        receiptFooter: initial?.receiptFooter || '',
        status: (initial?.status ?? 'active') === 'active' ? 'active' : 'inactive',
    };

    // Form State
    const [formData, setFormData] = useState<Required<StoreData>>(initialFormData);
    const [loading, setLoading] = useState(false);
    // Step state removed as it's not being used

    const updateFormData = (updates: Partial<Required<StoreData>>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    // Modal visibility
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showStoreTypePicker, setShowStoreTypePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState<{
        field: 'weekdayOpen' | 'weekdayClose' | 'weekendOpen' | 'weekendClose' | null;
    }>({ field: null });
    const [showDropdown, setShowDropdown] = useState<{
        field: 'currency' | 'timezone' | 'countryCode' | 'year' | 'manager' | null;
    }>({ field: null });

    const years = useMemo(() => {
        const y: string[] = [];
        const now = new Date().getFullYear();
        for (let i = now; i >= 1900; i--) y.push(String(i));
        return y;
    }, []);

    const selectedStoreType = STORE_TYPES.find((t) => t.label === formData.type) || STORE_TYPES[0];
    const suggestedLogos = selectedStoreType.suggestedLogos;
    const selectedCountry =
        COUNTRY_CODES.find((c) => c.code === formData.countryCode) || COUNTRY_CODES[0];
    const selectedManager = MANAGERS.find((m) => m.id === formData.managerId);

    const handleSubmit = async () => {
        if (
            !formData.name ||
            !formData.description ||
            !formData.currency ||
            !formData.timezone ||
            !formData.countryCode
        ) {
            Alert.alert('Missing Information', 'Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            if (createDirect) {
                if (!selectedBusiness) {
                    Alert.alert(
                        'No business selected',
                        'Please select a business before creating a store.',
                    );
                    return;
                }
                const created = await storeService.createStore(selectedBusiness.id, formData);
                if (!created) throw new Error('createStore returned null');
                // notify parent if it wants to react to successful creation
                if (onCreate) await onCreate(formData);
            } else {
                if (!onCreate) {
                    console.warn(
                        'StoreForm: createDirect is false but no onCreate handler provided',
                    );
                } else {
                    await onCreate(formData);
                }
            }
        } catch (error) {
            console.error('Error creating store:', error);
            Alert.alert('Error', 'Failed to create store. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const formatTimeDisplay = (time24: string) => {
        const [h, m] = time24.split(':').map(Number);
        const isPM = h >= 12;
        const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${
            isPM ? 'PM' : 'AM'
        }`;
    };

    const handleTimeConfirm = (time: string) => {
        const field = showTimePicker.field;
        if (!field) return;
        updateFormData({ [field]: time });
        setShowTimePicker({ field: null });
    };

    const getCurrentTimeValue = () => {
        if (!showTimePicker.field) return formData.weekdayOpen;
        return formData[showTimePicker.field];
    };

    const isStoreActive = formData.status === 'active';

    return (
        <View className='flex-1 bg-white'>
            <StatusBar barStyle='dark-content' />

            {/* Header */}
            <View className='px-6 py-2  border-b border-gray-200 bg-white'>
                <Text className='text-lg font-semibold text-gray-900'>Create Store</Text>
            </View>

            {/* Scrollable Content */}

            <KeyboardAvoidingView className='flex-1' behavior='padding'>
                <ScrollView>
                    <BasicInfoSection
                        logoEmoji={formData.logoEmoji}
                        onEmojiPress={() => setShowEmojiPicker(true)}
                        name={formData.name}
                        onNameChange={(name: string) => updateFormData({ name })}
                        type={formData.type}
                        onTypePress={() => setShowStoreTypePicker(true)}
                        selectedStoreType={selectedStoreType}
                        establishedYear={formData.establishedYear}
                        onYearPress={() => setShowDropdown({ field: 'year' })}
                        statusActive={isStoreActive}
                        onStatusChange={(active) =>
                            updateFormData({ status: active ? 'active' : 'inactive' })
                        }
                    />

                    <ContactSection
                        address={formData.address}
                        onAddressChange={(address) => updateFormData({ address })}
                        countryCode={formData.countryCode}
                        selectedCountry={selectedCountry}
                        onCountryCodePress={() => setShowDropdown({ field: 'countryCode' })}
                        phone={formData.phone}
                        onPhoneChange={(phone) => updateFormData({ phone })}
                        email={formData.email}
                        onEmailChange={(email) => updateFormData({ email })}
                    />

                    <OperatingHoursSection
                        weekdayOpen={formData.weekdayOpen}
                        weekdayClose={formData.weekdayClose}
                        weekendOpen={formData.weekendOpen}
                        weekendClose={formData.weekendClose}
                        formatTimeDisplay={formatTimeDisplay}
                        onTimePress={(field) => setShowTimePicker({ field })}
                    />

                    <StoreSettingsSection
                        currency={formData.currency}
                        onCurrencyPress={() => setShowDropdown({ field: 'currency' })}
                        timezone={formData.timezone}
                        onTimezonePress={() => setShowDropdown({ field: 'timezone' })}
                    />

                    <AdditionalDetailsSection
                        taxId={formData.taxId}
                        onTaxIdChange={(taxId) => updateFormData({ taxId })}
                        managerId={formData.managerId}
                        selectedManager={selectedManager}
                        onManagerPress={() => setShowDropdown({ field: 'manager' })}
                        receiptFooter={formData.receiptFooter}
                        onReceiptFooterChange={(receiptFooter) => updateFormData({ receiptFooter })}
                        description={formData.description}
                        onDescriptionChange={(description) => updateFormData({ description })}
                    />

                    {/* Footer */}
                    {showFooterButtons && (
                        <View className='flex-row px-6 py-4 border-t border-gray-200 bg-white gap-2'>
                            <CustomButton
                                onPress={() => onCancel?.()}
                                title='Cancel'
                                variant='outline'
                            />
                            <CustomButton
                                onPress={handleSubmit}
                                title={loading ? 'Creating Store...' : 'Create Store'}
                                disabled={!formData.name || loading}
                            />
                        </View>
                    )}

                    {/* Modals */}
                    <EmojiPickerModal
                        visible={showEmojiPicker}
                        onClose={() => setShowEmojiPicker(false)}
                        value={formData.logoEmoji}
                        onSelect={(logoEmoji: string) => {
                            updateFormData({ logoEmoji });
                            setShowEmojiPicker(false);
                        }}
                        suggestedEmojis={suggestedLogos}
                        allEmojis={ALL_EMOJIS}
                    />

                    <StoreTypeModal
                        visible={showStoreTypePicker}
                        onClose={() => setShowStoreTypePicker(false)}
                        value={formData.type}
                        onSelect={(type) => {
                            const storeType = STORE_TYPES.find((t) => t.label === type);
                            if (storeType) {
                                updateFormData({
                                    type,
                                    logoEmoji: storeType.suggestedLogos[0],
                                });
                            }
                            setShowStoreTypePicker(false);
                        }}
                        options={STORE_TYPES}
                    />

                    {showTimePicker.field && (
                        <TimePickerModal
                            visible={true}
                            onClose={() => setShowTimePicker({ field: null })}
                            value={getCurrentTimeValue()}
                            onConfirm={handleTimeConfirm}
                        />
                    )}

                    {showDropdown.field === 'currency' && (
                        <DropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            title='Select Currency'
                            value={formData.currency}
                            options={CURRENCIES}
                            onSelect={(currency: string) => {
                                updateFormData({ currency });
                                setShowDropdown({ field: null });
                            }}
                        />
                    )}

                    {showDropdown.field === 'timezone' && (
                        <DropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            title='Select Timezone'
                            value={formData.timezone}
                            options={TIMEZONES}
                            onSelect={(timezone: string) => {
                                updateFormData({ timezone });
                                setShowDropdown({ field: null });
                            }}
                        />
                    )}

                    {showDropdown.field === 'countryCode' && (
                        <DropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            title='Select Country Code'
                            value={formData.countryCode}
                            options={COUNTRY_CODES.map((c) => c.code)}
                            displayOptions={COUNTRY_CODES.map(
                                (c) => `${c.flag} ${c.code} ${c.label}`,
                            )}
                            onSelect={(countryCode: string) => {
                                updateFormData({ countryCode });
                                setShowDropdown({ field: null });
                            }}
                        />
                    )}

                    {showDropdown.field === 'year' && (
                        <DropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            title='Select Year'
                            value={formData.establishedYear}
                            options={years}
                            onSelect={(establishedYear: string) => {
                                updateFormData({ establishedYear });
                                setShowDropdown({ field: null });
                            }}
                        />
                    )}

                    {showDropdown.field === 'manager' && (
                        <ManagerDropdownModal
                            visible={true}
                            onClose={() => setShowDropdown({ field: null })}
                            value={formData.managerId}
                            onSelect={(managerId: string) => {
                                updateFormData({ managerId });
                                setShowDropdown({ field: null });
                            }}
                            managers={[]}
                        />
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}
