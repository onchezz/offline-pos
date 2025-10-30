import { TabConfig } from '@/types';

export const SETTINGS_TABS: TabConfig[] = [
    {
        id: 'general',
        icon: 'settings-outline',
        title: 'General',
        description: 'App preferences and notifications',
    },
    {
        id: 'users',
        icon: 'people-outline',
        title: 'User Management',
        description: 'Manage staff and permissions',
    },
    {
        id: 'credit',
        icon: 'card-outline',
        title: 'Credit Settings',
        description: 'Configure credit policies',
    },
    {
        id: 'print',
        icon: 'print-outline',
        title: 'Print Settings',
        description: 'Receipt and printer configuration',
    },
];
