// import { Model, Relation } from '@nozbe/watermelondb';
// import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';
// import Inventory from './inventory';
// import Product from './products';
// import Store from './stores';
// import User from './users';

// export default class InventoryBatch extends Model {
//     static table = 'inventory_batches';
//     static associations = {
//         inventory: { type: 'belongs_to' as const, key: 'inventory_id' },
//         products: { type: 'belongs_to' as const, key: 'product_id' },
//         stores: { type: 'belongs_to' as const, key: 'store_id' },
//         users: { type: 'belongs_to' as const, key: 'user_id' },
//     };

//     @field('external_id') externalId!: string;
//     @field('inventory_id') inventoryId!: string;
//     @field('product_id') productId!: string;
//     @field('store_id') storeId!: string;
//     @field('user_id') userId!: string;
//     @field('quantity_change') quantityChange!: number;
//     @field('quantity_before') quantityBefore!: number;
//     @field('quantity_after') quantityAfter!: number;
//     @field('cost_per_unit') costPerUnit!: number;
//     @text('batch_type') batchType!: 'purchase' | 'sale' | 'adjustment' | 'return' | 'damage';
//     @field('reference_id') referenceId!: string;
//     @text('notes') notes!: string;
//     @readonly @date('created_at') createdAt!: Date;
//     @date('updated_at') updatedAt!: Date;

//     @relation('inventory', 'inventory_id') inventory!: Relation<Inventory>;
//     @relation('products', 'product_id') product!: Relation<Product>;
//     @relation('stores', 'store_id') store!: Relation<Store>;
//     @relation('users', 'user_id') user!: Relation<User>;
// }
