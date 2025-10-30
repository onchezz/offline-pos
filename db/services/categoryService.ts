import capitalizeName from '@/utils/wordCapitlization';
import { Q } from '@nozbe/watermelondb';
import { categoriesCollection, database } from '..';
import Category from '../models/categories';

export const categoryService = {
    async createCategory(data: {
        storeId: string;
        businessId: string;
        name: string;
        icon?: string;
        color?: string;
    }) {
        return await database.write(async () => {
            return await categoriesCollection.create((category) => {
                category.externalId = `cat_${data.name}_${Date.now()}`;
                category.businessId = data.businessId;
                category.storeId = data.storeId;
                category.name = capitalizeName(data.name);
                category.icon = data.icon || '📦';
                category.color = data.color || '#6B7280';
                category.deleted = false;
            });
        });
    },

    async updateCategory(
        categoryId: string,
        updates: Partial<{
            name: string;
            icon: string;
            color: string;
        }>,
    ) {
        const category = await categoriesCollection.find(categoryId);

        return await database.write(async () => {
            return await category.update((c) => {
                if (updates.name !== undefined) c.name = capitalizeName(updates.name);
                if (updates.icon !== undefined) c.icon = updates.icon;
                if (updates.color !== undefined) c.color = updates.color;
            });
        });
    },

    async deleteCategory(categoryId: string) {
        const category = await categoriesCollection.find(categoryId);

        return await database.write(async () => {
            return await category.update((c) => {
                c.deleted = true;
            });
        });
    },

    async getCategoryById(categoryId: string) {
        return await categoriesCollection.find(categoryId);
    },

    async getCategoriesByBusiness(businessId: string) {
        return await categoriesCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.sortBy('name', Q.asc),
            )
            .fetch();
    },
    async observeCategoriesByBusiness(businessId: string, callback: (cats: Category[]) => void) {
        const subscription = categoriesCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.sortBy('name', Q.asc),
            )
            .observe()
            .subscribe(callback);

        return () => subscription.unsubscribe();
    },

    // New: fetch categories scoped to a store (categories are often store-scoped)
    async getCategoriesByStore(storeId: string) {
        return await categoriesCollection
            .query(Q.where('store_id', storeId), Q.where('deleted', false), Q.sortBy('name', Q.asc))
            .fetch();
    },

    async observeCategoriesByStore(storeId: string, callback: (cats: Category[]) => void) {
        const subscription = categoriesCollection
            .query(Q.where('store_id', storeId), Q.where('deleted', false), Q.sortBy('name', Q.asc))
            .observe()
            .subscribe(callback);

        return () => subscription.unsubscribe();
    },

    async getCategoryWithProducts(categoryId: string) {
        const category = await categoriesCollection.find(categoryId);
        const products = await category.products.fetch();
        return { category, products };
    },
};
