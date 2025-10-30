import { InventoryUpdate } from '@/types';
import { Q } from '@nozbe/watermelondb';
import { database, inventoryCollection } from '..';
export const inventoryService = {
    async createInventory(data: {
        productId: string;
        storeId: string;
        quantity?: number;
        minStock?: number;
        maxStock?: number;
        price: number;
        wholeSalePrice?: number;
        weightedAvgCost?: number;
        lastPurchasePrice?: number;
        location?: string;
    }) {
        return await database.write(async () => {
            return await inventoryCollection.create((inventory) => {
                inventory.externalId = `inv_${Date.now()}`;
                inventory.productId = data.productId;
                inventory.storeId = data.storeId;
                inventory.quantity = data.quantity || 0;
                inventory.minStock = data.minStock || 0;
                inventory.maxStock = data.maxStock || 100;
                inventory.price = data.price;
                inventory.wholeSalePrice = data.wholeSalePrice || 0;
                inventory.weightedAvgCost = data.weightedAvgCost || 0;
                inventory.lastPurchasePrice = data.lastPurchasePrice || 0;
                inventory.location = data.location || '';
                inventory.deleted = false;
            });
        });
    },

    // async adjustInventoryWithBatch(
    //     inventoryId: string,
    //     quantityChange: number,
    //     batchData: {
    //         userId: string;
    //         costPerUnit?: number;
    //         batchType: 'purchase' | 'sale' | 'adjustment' | 'return' | 'damage';
    //         referenceId?: string;
    //         notes?: string;
    //     },
    // ) {
    //     const inventory = await inventoryCollection.find(inventoryId);
    //     // const batchesCollection = database.collections.get<InventoryBatch>('inventory_batches');

    //     return await database.write(async () => {
    //         const quantityBefore = inventory.quantity || 0;
    //         const quantityAfter = quantityBefore + quantityChange;

    //         await inventory.update((inv) => {
    //             inv.quantity = quantityAfter;

    //             if (batchData.costPerUnit && batchData.batchType === 'purchase') {
    //                 inv.lastPurchasePrice = batchData.costPerUnit;

    //                 const totalValue =
    //                     (inv.weightedAvgCost || 0) * quantityBefore +
    //                     batchData.costPerUnit * Math.abs(quantityChange);
    //                 inv.weightedAvgCost = totalValue / quantityAfter;
    //             }
    //         });

    //         await inventoryBatchesCollection.create((batch) => {
    //             batch.externalId = `batch_${Date.now()}`;
    //             batch.inventoryId = inventoryId;
    //             batch.productId = inventory.productId;
    //             batch.storeId = inventory.storeId;
    //             batch.userId = batchData.userId;
    //             batch.quantityChange = quantityChange;
    //             batch.quantityBefore = quantityBefore;
    //             batch.quantityAfter = quantityAfter;
    //             batch.costPerUnit = batchData.costPerUnit || 0;
    //             batch.batchType = batchData.batchType;
    //             batch.referenceId = batchData.referenceId || '';
    //             batch.notes = batchData.notes || '';
    //         });

    //         return inventory;
    //     });
    // },

    async updateInventoryPricing(inventoryId: string, updates: InventoryUpdate) {
        const inventory = await inventoryCollection.find(inventoryId);
        console.log(
            'Updating inventory pricing for ID:',
            inventoryId,
            'quantity:',
            updates.quantity,
        );

        return await database.write(async () => {
            return await inventory.update((inv) => {
                if (updates.price !== undefined) inv.price = updates.price;
                if (updates.wholeSalePrice !== undefined)
                    inv.wholeSalePrice = updates.wholeSalePrice;
                if (updates.quantity !== undefined) inv.quantity = updates.quantity;
                if (updates.lastPurchasePrice !== undefined)
                    inv.lastPurchasePrice = updates.lastPurchasePrice;
                if (updates.weightedAvgCost !== undefined)
                    inv.weightedAvgCost = updates.weightedAvgCost;
                if (updates.minStock !== undefined) inv.minStock = updates.minStock;
                if (updates.maxStock !== undefined) inv.maxStock = updates.maxStock;
                if (updates.location !== undefined) inv.location = updates.location;
            });
        });
    },

    async getInventoryByStore(storeId: string) {
        return await inventoryCollection
            .query(
                Q.where('store_id', storeId),
                Q.where('deleted', false),
                Q.sortBy('last_updated', Q.desc),
            )
            .fetch();
    },

    async getInventoryByProduct(productId: string, storeId: string) {
        const inventories = await inventoryCollection
            .query(
                Q.where('product_id', productId),
                Q.where('store_id', storeId),
                Q.where('deleted', false),
            )
            .fetch();

        return inventories.length > 0 ? inventories[0] : null;
    },

    async getLowStockItems(storeId: string) {
        const allInventory = await inventoryCollection
            .query(Q.where('store_id', storeId), Q.where('deleted', false))
            .fetch();

        return allInventory.filter((inv) => (inv.quantity || 0) <= (inv.minStock || 0));
    },

    // async getInventoryBatches(inventoryId: string, limit: number = 50) {
    //     return await inventoryBatchesCollection
    //         .query(
    //             Q.where('inventory_id', inventoryId),
    //             Q.sortBy('created_at', Q.desc),
    //             Q.take(limit),
    //         )
    //         .fetch();
    // },

    async getInventoryWithProduct(inventoryId: string) {
        const inventory = await inventoryCollection.find(inventoryId);
        const product = await inventory.product.fetch();
        const category = await product.category.fetch();
        return { inventory, product, category };
    },
};
