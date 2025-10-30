import { useBusiness } from '@/contexts/BusinessContext';
//import { logout } from '@/db/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { database } from '@/db';

export const useAccountActions = () => {
    const { selectedStore, selectedBusiness } = useBusiness();
    const { logout } = useAuth();
    const handleMyAccount = useCallback((userExternalId: string) => {
        console.log('Navigate to My Account details');
        router.push({
            pathname: '/account/profile',
            params: {
                externalId: userExternalId,
                edit: 'false',
            },
        });
    }, []);

    const handleEdit = useCallback((userExternalId: string) => {
        console.log('Navigate to Edit Profile');
        router.push({
            pathname: '/account/profile',
            params: {
                externalId: userExternalId,
                edit: 'true',
            },
        });
    }, []);

    const handleStoreEdit = useCallback((storeExternalId: string) => {
        console.log('Navigate to Edit Profile');
        router.push({
            pathname: '/account/store-profile',
            params: {
                externalId: storeExternalId,
                edit: 'true',
            },
        });
    }, []);

    const handleLogout = useCallback(async () => {
        console.log('🚪 Logging out...');
        await logout();

        await new Promise((resolve) => setTimeout(resolve, 100));

        router.push('/auth/login');
    }, []);

    const handleSettings = useCallback(() => {
        console.log('Navigate to Settings');
        router.push('/account/settings');
    }, []);

    const handleSwitchStore = useCallback(() => {
        console.log('Open store switcher');
        // Show modal or navigate to store selection
    }, []);

    const handleManageCredit = useCallback(() => {
        console.log('Navigate to Manage Credit');
        router.push('/credit');
    }, []);

    const handleSalesHistory = useCallback(() => {
        console.log('Navigate to Sales History');
        router.push('/account/sales');
    }, []);

    return {
        handleMyAccount,
        handleEdit,
        handleLogout,
        handleSettings,
        handleSwitchStore,
        handleManageCredit,
        handleSalesHistory,
        handleStoreEdit,
    };
};
