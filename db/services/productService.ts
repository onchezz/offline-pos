import { ProductUpdate } from '@/types';
import capitalizeName from '@/utils/wordCapitlization';
import { Q } from '@nozbe/watermelondb';
import { database, productsCollection } from '..';
import Product from '../models/products';

export const productService = {
    async createProduct(data: {
        storeId: string;
        categoryId: string;
        name: string;
        brand: string;
        cost?: number;
        barcode?: string;
        description?: string;
        unit?: string;
        quantityPerUnit?: string;
        status?: string;
    }) {
        const newProduct = await database.write(async () => {
            return await productsCollection.create((product) => {
                product.externalId = `prod_${Date.now()}`;
                product.storeId = data.storeId;
                product.categoryId = data.categoryId;
                product.name = capitalizeName(data.name);
                product.brand = capitalizeName(data.brand);
                product.barcode = data.barcode || '';
                product.description = data.description || '';
                product.unit = data.unit || 'pcs';
                product.quantityPerUnit = data.quantityPerUnit || '1 pc';
                product.status = data.status || 'active';
                product.deleted = false;
            });
        });

        return newProduct;
    },

    async updateProduct(productId: string, updates: ProductUpdate) {
        console.log('Updating product with updates:', updates);
        const product = await database.collections.get<Product>('products').find(productId);

        const update = await database.write(async () => {
            return await product.update((p) => {
                if (updates.name !== undefined) p.name = capitalizeName(updates.name);
                if (updates.categoryId !== undefined) p.categoryId = updates.categoryId;
                if (updates.brand !== undefined) p.brand = capitalizeName(updates.brand);
                if (updates.barcode !== undefined) p.barcode = updates.barcode;
                if (updates.description !== undefined) p.description = updates.description;
                if (updates.unit !== undefined) p.unit = updates.unit;
                if (updates.quantityPerUnit !== undefined)
                    p.quantityPerUnit = updates.quantityPerUnit;
                if (updates.status !== undefined) p.status = updates.status;
            });
        });
        console.log('Updated product:', update);
        return update;
    },

    async deleteProduct(productId: string) {
        const product = await productsCollection.find(productId);

        return await database.write(async () => {
            return await product.update((p) => {
                p.deleted = true;
                p.status = 'inactive';
            });
        });
    },

    async getProductById(productId: string) {
        return await productsCollection.find(productId);
    },

    async getProductsByBusiness(businessId: string) {
        return await productsCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.sortBy('created_at', Q.desc),
            )
            .fetch();
    },

    async getProductsByCategory(categoryId: string) {
        return await productsCollection
            .query(
                Q.where('category_id', categoryId),
                Q.where('deleted', false),
                Q.sortBy('name', Q.asc),
            )
            .fetch();
    },

    async searchProducts(businessId: string, searchTerm: string) {
        return await productsCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.or(
                    Q.where('name', Q.like(`%${Q.sanitizeLikeString(searchTerm)}%`)),
                    Q.where('barcode', Q.like(`%${Q.sanitizeLikeString(searchTerm)}%`)),
                ),
                Q.sortBy('name', Q.asc),
            )
            .fetch();
    },

    async getProductWithCategory(productId: string) {
        const product = await productsCollection.find(productId);
        const category = await product.category.fetch();
        return { product, category };
    },
};
