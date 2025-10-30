import Sale from '@/db/models/sales';
import SaleItem from '@/db/models/sales_items';
import { Ionicons } from '@expo/vector-icons';
import { LucideIcon } from 'lucide-react-native';

export type Screen = 'main' | 'checkout-category' | 'checkout' | 'inventory' | 'inventory-category'; //- suggesting a better approach

// export enum StoreType {
//     RETAIL = 'retail',
//     WHOLESALE = 'wholesale',
//     RESTAURANT = 'restaurant',
//     SERVICE = 'service',
//     OTHER = 'other',
// }

export interface StoreData {
    storeId?: string;
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
    wholesaleEnabled?: boolean;
}

export interface StoreFormProps {
    initial?: Partial<StoreData>;
    onCancel: () => void;
    onCreate: (data: StoreData) => void;
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

// Type
//  definitions
export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    inventory: number;
    discount?: number;
    discountMode?: 'percent' | 'amount';
}

export interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
}

// Type definitions
export interface CategoryItem {
    id: string;
    name: string;
    count: number;
    icon: string;
    color: string;
}

// Compatibility alias for components that import `Category` from '@/types'
export interface Category extends CategoryItem {
    externalId?: string;
    businessId?: string;
    createdAt?: number;
    deleted?: boolean;
}

export interface Store {
    id?: string;
    businessId?: string;
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
    managerId?: string;
    status?: string;
    currency?: string;
    createdAt?: number;
    updatedAt?: number;
    deleted?: boolean;
}

// Type definitions
export interface CategoryData {
    name: string;
    icon: string;
    color: string;
}

export interface QuickItem {
    name: string;
    price: string;
}

// ???????
export interface Product {
    // Core identification
    id: string;
    name: string;
    brand?: string;
    barcode?: string; // SKU/barcode
    category: string;
    type?: string; // Product type/subcategory
    price: number;
    quantity?: number;
    stock?: number; // Alias for quantity (for backward compatibility)
    unit: string; // 'pcs', 'kg', 'ltr', etc.
    lowStockThreshold?: number; // When to show low stock warning
    isLowStock?: boolean;
    isOut?: boolean;
    isOrdered?: boolean;
    quantityText?: string; // "5 pcs", "2.5 kg", etc.
    size?: string; // "500ml", "1kg", etc. - for display
    inCart?: number;
    description?: string;
    createdAt?: number;
    updatedAt?: number;
    minimumAlert?: number;
    purchasePrice?: number;
}

export interface SizeConfig {
    padding: string;
    iconSize: number;
    textSize: string;
    minWidth?: string;
    height?: string;
}

export interface VariantConfig {
    bg: string;
    bgDisabled: string;
    textColor: string;
    textColorDisabled: string;
    iconColor: string;
    iconColorDisabled: string;
    borderColor?: string;
}

export interface AnimationConfig {
    scale: number;
    tension: number;
    friction: number;
}

export type CreditRating = 'Low' | 'Medium' | 'Good';

export interface Customer {
    id: string;
    name: string;
    amount: number;
    phone: string;
    email: string;
    dueDate: string;
    rating: CreditRating;
    daysLeft: number;
    currentBalance: number;
}

export type FilterState = {
    Low: 'Low';
    Out: 'Out';
    All?: 'All';
    Ordered?: 'Ordered';
};

export interface InventoryProductData {
    categoryId: string;
    name: string;
    cost: string;
    barcode: string;
    description: string;
    unit: string;
    minStock: number;
    maxStock: number;
    price: number;
    location: string;
    initialQuantity: number;
}

export interface ProductData {
    storeId: string;
    categoryId: string;
    name: string;
    brand: string;
    barcode?: string;
    description?: string;
    unit: string;
    quantityPerUnit: string;
    status: 'active';
}

export interface InventoryItemData {
    productId: string;
    storeId: string;
    quantity: number;
    minStock: number;
    maxStock: number;
    price: number;
    wholeSalePrice: number;
    weightedAvgCost: number;
    lastPurchasePrice: number;
    location: string;
}

// Combined view type used by inventory lists (product + inventory fields)
export interface InventoryViewItem {
    id: string; // inventory id
    productId: string;
    name: string;
    category: string;
    categoryId: string;
    brand?: string;
    categoryIcon?: string;
    categoryColor?: string;
    quantity: number;
    wholeSalePrice: string;
    description: string;
    quantityPerUnit: string;
    minStock: number;
    maxStock: number;
    price: number;
    lastAvgCost: number;
    averageCost: number;
    unit: string;
    barcode?: string;
    location?: string;
    lastUpdated?: Date;
}

export interface UserData {
    externalId?: string; // Now optional - will be generated if not provided
    email: string;
    name: string;
    phone: string;
    password: string;
    pin?: string;
    isOwner?: boolean;
}
export interface AuthData {
    email: string;
    password?: string;
    pin?: string;
}

export interface BusinessStoreData {
    businessName: string;
    storeName: string;
    storeAddress?: string;
    storePhone?: string;
    storeEmail?: string;
}

export interface Business {
    externalId?: string;
    name: string;
    businessType?: string;
    ownerId: string;
    createdAt: number;
    updatedAt: number;
    deleted?: boolean;
}

export type PaymentMethodType = 'Cash' | 'M-Pesa' | 'Bank Transfer' | 'Card';

// this will be worked on - idealy use the same type

export interface User {
    id?: string;
    externalId: string;
    name: string;
    email: string;
    lastLogin?: string;
    role: string;
    phoneNumber?: string;
}

export interface UserProfileData {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phone: string;
    emergencyContact: string;
    joinDate: string;
    permissions: string[];
}

export interface TodayStats {
    revenue: number;
    orders: number;
    profit: number;
    netCredit: number;
}

export interface CreditSummary {
    totalOwed: number;
    customersWithCredit: number;
    overdueAmount: number;
}

export type TabType = 'Overview' | 'Sales' | 'History';

export interface UserFormData {
    fullName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export interface RoleWithUserCount {
    id: number;
    name: string;
    userCount: number;
    permissions: string[];
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

export interface CreditLimitsData {
    maxPerCustomer: string;
    maxPerTransaction: string;
    creditDays: string;
}

export interface AdvancedSettingsData {
    requireManagerApproval: boolean;
    autoApprovalLimit: string;
    enableInterestCharges: boolean;
}

export interface PrintSettingsData {
    autoPrintReceipts: boolean;
    printerName: string;
    paperWidth: string;
    fontSize: string;
    includeStoreHeader: boolean;
    includeFooterMessage: boolean;
}

export interface TabConfig {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
}

export type RatingType = 'Low' | 'Medium' | 'Good';

export type ItemWithProduct = {
    item: SaleItem;
    product:
        | Product
        | {
              id: string;
              name: string;
              barcode?: string;
              category?: string;
              unit?: string;
              price?: number;
          };
};

export type SaleWithExtras = Sale & {
    // some code paths may attach computed/denormalized fields
    storeName?: string;
    cashierName?: string;
    contact?: string;
};
export type InventoryUpdate = {
    price?: number;
    wholeSalePrice?: number;
    lastPurchasePrice: number;
    weightedAvgCost: number;
    quantity: number;
    minStock?: number;
    maxStock?: number;
    location?: string;
};
export type ProductUpdate = {
    name: string;
    brand: string;
    categoryId: string;
    barcode: string;
    description: string;
    unit: string;
    quantityPerUnit: string;
    status: string;
};
