import CreditSettings from '@/components/account/settings/credits/Index';
import GeneralSettings from '@/components/account/settings/general';
import PrintSettings from '@/components/account/settings/print';
import { SettingsHeader } from '@/components/account/settings/SettingsHeader';
import { SettingsTab } from '@/components/account/settings/SettingsTab';
import UserManagement from '@/components/account/settings/user_management';
import { SETTINGS_TABS } from '@/constants/settings';
import useStaff from '@/hooks/useStaffs';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('general');

    const handleBack = (): void => {
        router.back();
    };

    const { users, roles } = useStaff();

    return (
        <SafeAreaView className='flex-1 bg-gray-50' edges={['top', 'left', 'right']}>
            <SettingsHeader onBack={handleBack} title='Settings' />

            <ScrollView className='flex-1'>
                {/* Tab Buttons */}
                <View className='px-4 mt-4'>
                    {SETTINGS_TABS.map((tab) => (
                        <SettingsTab
                            key={tab.id}
                            tab={tab}
                            activeTab={activeTab}
                            onPress={setActiveTab}
                        />
                    ))}
                </View>

                {/* Tab Content */}
                {activeTab === 'general' && <GeneralSettings />}

                {activeTab === 'users' && (
                    <UserManagement
                        initialTab='users'
                        onAddUser={(userData) => console.log(userData)}
                        onEditUser={(id, userData) => console.log(id, userData)}
                        onDeleteUser={(id) => console.log(id)}
                        users={users}
                        roles={roles}
                    />
                )}

                {activeTab === 'credit' && (
                    <CreditSettings
                        onSaveLimits={(data) => console.log('Save:', data)}
                        onToggleCreditSystem={(enabled) => console.log('Toggle:', enabled)}
                    />
                )}

                {activeTab === 'print' && (
                    <PrintSettings onSave={(data) => console.log('Save:', data)} />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SettingsScreen;
