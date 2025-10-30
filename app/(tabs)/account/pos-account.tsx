import { AccountHeader } from '@/components/account/AccountHeader';
import { CreditSummary, TabType, TodayStats } from '@/types';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HistoryTab } from '@/components/account/history/HistoryTab';
import { ProfileCard } from '@/components/account/profile/ProfileCard';
import { QuickActionsCard } from '@/components/account/QuickActionsCard';
import { OverviewTab } from '@/components/account/stats/OverviewTab';
import { SalesTab } from '@/components/account/stats/SalesTab';
import { StoreInfoCard } from '@/components/account/store/StoreInfoCard';
import { TabSelector } from '@/components/account/TabSelector';
import { UnauthenticatedView } from '@/components/account/UnauthenticatedView';
import { business, stats, store } from '@/constants/account';

import { useAccountActions } from '@/hooks/useAccountActions';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
import Session from '@/db/models/sessions';
import User from '@/db/models/users';

interface AccountScreenProps {
    activeSession: Session | null;
    user: User | null;
    isAuthenticated: boolean;
    todayStats?: TodayStats;
    // creditSummary?: CreditSummary;
    // currentStore?: Store;
    // currentBusiness?: Business;
}

const AccountScreen: React.FC<AccountScreenProps> = ({
    activeSession,
    // user,
    isAuthenticated,
    todayStats,
    // creditSummary,
    // currentStore,
    // currentBusiness,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('Overview');
    const [selectedPeriod, setSelectedPeriod] = useState('Today');
    const { selectedBusiness, selectedStore } = useBusiness();
    const { user } = useAuth();

    const {
        handleMyAccount,
        handleEdit,
        handleLogout,
        handleSettings,
        handleSwitchStore,
        handleManageCredit,
        handleSalesHistory,
        handleStoreEdit,
    } = useAccountActions();

    // Unauthenticated state
    if (!isAuthenticated || !user) {
        return <UnauthenticatedView />;
    }

    const handlePeriodChange = () => {
        // TODO: Show period selector modal
        console.log('Change period');
    };

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <AccountHeader onSettingsPress={handleSettings} />

                <View className='p-4'>
                    <ProfileCard
                        user={user}
                        store={selectedStore}
                        onMyAccountPress={handleMyAccount}
                        onEditPress={handleEdit}
                        onLogoutPress={handleLogout}
                    />

                    <StoreInfoCard
                        store={selectedStore}
                        business={selectedBusiness}
                        onStoreEditPress={handleStoreEdit}
                        onSwitchStore={handleSwitchStore}
                    />

                    <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

                    {/* Tab Content */}
                    {activeTab === 'Overview' && (
                        <OverviewTab
                            stats={stats || todayStats}
                            selectedPeriod={selectedPeriod}
                            onPeriodChange={handlePeriodChange}
                        />
                    )}

                    {activeTab === 'Sales' && <SalesTab stats={stats || todayStats} />}

                    {activeTab === 'History' && <HistoryTab />}

                    <QuickActionsCard
                        onManageCredit={handleManageCredit}
                        onSalesHistory={handleSalesHistory}
                    />

                    {/* Extra padding for bottom nav */}
                    <View className='h-20' />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AccountScreen;
