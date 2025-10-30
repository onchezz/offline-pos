import { useBusiness } from '@/contexts/BusinessContext';
import { inventoryCollection } from '@/db';
import { categoryService } from '@/db/services/categoryService';
import { CategoryItem, InventoryViewItem } from '@/types';
import { Q } from '@nozbe/watermelondb';
import { useEffect, useMemo, useState } from 'react';

// Local typed shapes representing WatermelonDB model relations used by this hook.
interface CategoryModelFetchResult {
    id: string;
    name: string;
    icon?: string;
    color?: string;
}

interface ProductModelFetchResult {
    id: string;
    name: string;
    unit?: string;
    barcode?: string;
    cost?: number;
    brand?: string;
    description?: string;
    quantityPerUnit?: string;
    category: {
        fetch: () => Promise<CategoryModelFetchResult>;
    };
}

interface InventoryModelFetchResult {
    id: string;
    quantity?: number;
    price?: number;
    minStock?: number;
    maxStock?: number;
    location?: string;
    weightedAvgCost?: number;
    lastAvgCost?: number;
    wholeSalePrice: number;
    lastUpdated?: Date;
    product: {
        fetch: () => Promise<ProductModelFetchResult>;
    };
}

export function useInventoryData(): {
    inventory: InventoryViewItem[];
    categories: CategoryItem[];
    rawCategories: CategoryItem[];
    loading: boolean;
    refreshinvetoryData: () => Promise<void>;
} {
    const { selectedStore } = useBusiness();
    const [inventory, setInventory] = useState<InventoryViewItem[]>([]);
    const [rawCategories, setRawCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Subscribe to inventory changes
    useEffect(() => {
        if (!selectedStore) {
            setLoading(false);
            return;
        }

        const subscription = inventoryCollection
            .query(Q.where('store_id', selectedStore.id))
            .observeWithColumns(['quantity', 'price', 'min_stock', 'max_stock', 'location'])
            .subscribe(async (invData) => {
                try {
                    const inventoryWithDetails = await Promise.all(
                        invData.map(async (inv: InventoryModelFetchResult) => {
                            const product = await inv.product.fetch();

                            const category = await product.category.fetch();

                            const viewItem: InventoryViewItem = {
                                id: inv.id,
                                productId: product.id,
                                name: product.name,
                                brand: product.brand,
                                category: category.name,
                                categoryId: category.id,
                                categoryIcon: category.icon,
                                categoryColor: category.color,
                                quantity: inv.quantity || 0,
                                minStock: inv.minStock || 0,
                                maxStock: inv.maxStock || 100,
                                price: inv.price || 0,
                                averageCost: inv.weightedAvgCost || 0,
                                lastAvgCost: inv.lastAvgCost || 0,
                                unit: product.unit || 'pcs',
                                barcode: product.barcode || '',
                                location: inv.location || '',
                                lastUpdated: inv.lastUpdated || new Date(),
                                wholeSalePrice: inv.wholeSalePrice?.toString() || '',
                                description: product.description || '',
                                quantityPerUnit: product.quantityPerUnit || '',
                            };

                            return viewItem;
                        }),
                    );

                    setInventory(inventoryWithDetails);
                    setLoading(false);
                } catch (error) {
                    console.error('Error processing inventory data:', error);
                    setLoading(false);
                }
            });

        return () => subscription.unsubscribe();
    }, [selectedStore]);

    // Subscribe to category changes (scoped by selected store)
    useEffect(() => {
        if (!selectedStore) {
            // clear categories if no store selected
            setRawCategories([]);
            return;
        }

        const storeId = selectedStore.id;
        if (!storeId) return;

        let cancelled = false;
        let subscription: (() => void) | undefined;

        async function startSubscription() {
            try {
                subscription = await categoryService.observeCategoriesByStore(
                    storeId,
                    (catData: { id: string; name: string; icon?: string; color?: string }[]) => {
                        if (cancelled) return;
                        const mapped: CategoryItem[] = catData.map((cat) => ({
                            id: cat.id,
                            name: cat.name,
                            icon: cat.icon || '📦',
                            color: cat.color || '#6B7280',
                            count: 0,
                        }));

                        setRawCategories(mapped);
                    },
                );
            } catch (err) {
                console.error('Failed to observe categories by store:', err);
            }
        }

        startSubscription();

        return () => {
            cancelled = true;
            if (subscription) subscription();
        };
    }, [selectedStore, selectedStore?.id]);

    // Calculate categories with counts based on current inventory
    const categories = useMemo(() => {
        const categoriesWithCounts: CategoryItem[] = rawCategories.map((cat) => ({
            ...cat,
            count: inventory.filter((item) => item.categoryId === cat.id).length,
        }));

        const allCategory: CategoryItem = {
            id: 'all',
            name: 'All',
            icon: '📋',
            color: 'bg-gray-600',
            count: inventory.length,
        };

        return [allCategory, ...categoriesWithCounts];
    }, [rawCategories, inventory]);

    const refreshinvetoryData = async () => {
        if (!selectedStore) {
            return;
        }

        setLoading(true);

        try {
            const invData = await inventoryCollection
                .query(Q.where('store_id', selectedStore.id))
                .fetch();

            const inventoryWithDetails = await Promise.all(
                invData.map(async (inv: InventoryModelFetchResult) => {
                    const product = await inv.product.fetch();
                    const category = await product.category.fetch();

                    const viewItem: InventoryViewItem = {
                        id: inv.id,
                        productId: product.id,
                        name: product.name,
                        brand: product.brand,
                        category: category.name,
                        categoryId: category.id,
                        categoryIcon: category.icon,
                        categoryColor: category.color,
                        quantity: inv.quantity || 0,
                        minStock: inv.minStock || 0,
                        maxStock: inv.maxStock || 100,
                        price: inv.price || 0,
                        averageCost: inv.weightedAvgCost || 0,
                        lastAvgCost: inv.lastAvgCost || 0,
                        unit: product.unit || 'pcs',
                        barcode: product.barcode || '',
                        location: inv.location || '',
                        lastUpdated: inv.lastUpdated || new Date(),
                        wholeSalePrice: inv.wholeSalePrice?.toString() || '',
                        description: product.description || '',
                        quantityPerUnit: product.quantityPerUnit || '',
                    };

                    return viewItem;
                }),
            );

            setInventory(inventoryWithDetails);
        } catch (error) {
            console.error('Error refreshing inventory data:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        inventory,
        categories,
        rawCategories,
        loading,
        refreshinvetoryData,
    };
}
