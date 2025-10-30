export interface StoreData {
    name: string;
    type?: string;
    logoEmoji?: string;
    address?: string;
    phone?: string;
    countryCode?: string;
    email?: string;
    description?: string;
    weekdayOpen?: string;
    weekdayClose?: string;
    weekendOpen?: string;
    weekendClose?: string;
    taxId?: string;
    establishedYear?: string;
    managerId?: string;
    currency?: string;
    timezone?: string;
    receiptFooter?: string;
    status?: 'active' | 'inactive';
}

export interface StoreType {
    emoji: string;
    label: string;
    suggestedLogos: string[];
}

export interface CountryCode {
    code: string;
    label: string;
    flag: string;
}

export interface Manager {
    id: string;
    name: string;
    avatar: string;
}
