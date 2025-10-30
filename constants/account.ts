import { Business, Store, StoreData, TodayStats, UserProfileData } from '@/types';

// Default mock data if not provided
export const stats: TodayStats = {
    revenue: 0.0,
    orders: 0,
    profit: 0.0,
    netCredit: 0.0,
};

export const store: Store = {
    id: '1',
    name: 'FreshMart Downtown',
    businessId: 'FreshMart Group',
};

export const business: Business = {
    externalId: '1',
    name: 'FreshMart Downtown',
    businessType: 'FreshMart Group',
};

// TODO: Fetch user data using externalId
// For now, using placeholder data
export const userData: UserProfileData = {
    firstName: 'Amara',
    lastName: 'Ochieng',
    role: 'Store Manager',
    email: 'amara.ochieng@amarasduka.com',
    phone: '+254 701 234 567',
    emergencyContact: '+254 722 345 678',
    joinDate: 'March 15, 2019',
    permissions: ['Sales', 'Inventory', 'User Management', 'Reports'],
};

export const initialStoreData: StoreData = {
    name: "Amara's Duka",
    type: 'Convenience Store',
    establishedYear: '2019',
    phone: '+254 712 345 678',
    email: 'info@amarasduka.com',
    address: '123 Kenyatta Avenue, Nairobi 00100, Kenya',
    description:
        'Your friendly neighborhood convenience store offering fresh products and everyday essentials. We pride ourselves on quality service and community support.',
    businessHours: {
        weekdays: 'Monday - Saturday: 7:00 AM - 8:00 PM',
        weekend: 'Sunday: 8:00 AM - 6:00 PM',
    },
    taxId: 'P051234567M',
};