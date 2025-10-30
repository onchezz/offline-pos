import { Q } from '@nozbe/watermelondb';
import { inventoryCollection, saleItemsCollection, salesCollection } from '..';
import Product from '../models/products';
import { inventoryService } from './inventoryService';

export interface MostSoldProduct {
    productId: string;
    productName: string;
    totalQuantitySold: number;
    totalRevenue: number;
    inventoryId: string;
    price: number;
    wholeSalePrice?: number;
    currentStock: number;
}

export const mostSoldService = {
    async getMostSoldProducts(storeId: string, limit: number = 10): Promise<MostSoldProduct[]> {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // ✅ Fetch recent completed sales
            const sales = await salesCollection
                .query(
                    Q.where('store_id', storeId),
                    Q.where('status', 'completed'),
                    Q.where('created_at', Q.gte(thirtyDaysAgo.getTime())),
                )
                .fetch();

            if (sales.length === 0) {
                console.log('No sales found in the last 30 days');
                const inventories = await inventoryService.getInventoryByStore(storeId);
                if (inventories.length === 0) return [];

                const mostSold: MostSoldProduct[] = [];

                for (const invent of inventories) {
                    let inventoryProduct;
                    try {
                        inventoryProduct = await invent.product.fetch();
                    } catch {
                        console.warn(`Product not found for inventory ${invent.id}`);
                        continue;
                    }

                    mostSold.push({
                        productId: inventoryProduct.id,
                        productName: inventoryProduct.name,
                        totalQuantitySold: 0,
                        totalRevenue: 0,
                        inventoryId: invent.id,
                        price: invent.price,
                        wholeSalePrice: invent.wholeSalePrice,
                        currentStock: invent.quantity || 0,
                    });
                }

                return mostSold;
            }

            // ✅ Get sale items for all found sales
            const saleIds = sales.map((sale) => sale.id);
            const saleItems = await saleItemsCollection
                .query(Q.where('sale_id', Q.oneOf(saleIds)))
                .fetch();

            const productSales: Record<
                string,
                { quantity: number; revenue: number; productName: string }
            > = {};

            for (const item of saleItems) {
                let product: Product;
                try {
                    product = await item.product.fetch();
                } catch {
                    console.warn(`Product not found for sale item ID: ${item.id}`);
                    continue;
                }

                if (!productSales[product.id]) {
                    productSales[product.id] = {
                        quantity: 0,
                        revenue: 0,
                        productName: product.name,
                    };
                }

                productSales[product.id].quantity += item.quantity;
                productSales[product.id].revenue += item.totalPrice;
            }

            // ✅ Sort and prepare response
            const sortedProducts = Object.entries(productSales)
                .sort(([, a], [, b]) => b.quantity - a.quantity)
                .slice(0, limit);

            const mostSold: MostSoldProduct[] = [];

            for (const [productId, data] of sortedProducts) {
                const inventoryItems = await inventoryCollection
                    .query(
                        Q.where('product_id', productId),
                        Q.where('store_id', storeId),
                        Q.where('deleted', false),
                    )
                    .fetch();

                const inventory = inventoryItems[0];
                if (!inventory) continue;

                mostSold.push({
                    productId,
                    productName: data.productName,
                    totalQuantitySold: data.quantity,
                    totalRevenue: data.revenue,
                    inventoryId: inventory.id,
                    price: inventory.price,
                    wholeSalePrice: inventory.wholeSalePrice,
                    currentStock: inventory.quantity || 0,
                });
            }

            return mostSold;
        } catch (error) {
            console.error('Error fetching most sold products:', error);
            return [];
        }
    },
};
