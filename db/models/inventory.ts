import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text, writer } from '@nozbe/watermelondb/decorators';

import Product from './products';
import Store from './stores';

export default class Inventory extends Model {
    static table = 'inventory';
    static associations = {
        products: { type: 'belongs_to' as const, key: 'product_id' },
        stores: { type: 'belongs_to' as const, key: 'store_id' },
    };

    @field('external_id') externalId!: string;
    @field('product_id') productId!: string;
    @field('store_id') storeId!: string;
    @field('quantity') quantity!: number;
    @field('min_stock') minStock!: number;
    @field('max_stock') maxStock!: number;
    @field('price') price!: number;
    @field('whole_sale_price') wholeSalePrice!: number;
    @field('weighted_avg_cost') weightedAvgCost!: number;
    @field('last_purchase_price') lastPurchasePrice!: number;
    @text('location') location!: string;
    @readonly @date('last_updated') lastUpdated!: Date;
    @field('deleted') deleted!: boolean;

    @relation('products', 'product_id') product!: Relation<Product>;
    @relation('stores', 'store_id') store!: Relation<Store>;

    @writer async adjustQuantity(delta: number) {
        await this.update((i) => {
            i.quantity = (i.quantity || 0) + delta;
        });
    }
}
