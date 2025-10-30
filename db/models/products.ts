import { Model, Query, Relation } from '@nozbe/watermelondb';
import {
    children,
    date,
    field,
    readonly,
    relation,
    text,
    writer,
} from '@nozbe/watermelondb/decorators';
import Category from './categories';
import Inventory from './inventory';
import Store from './stores';

export default class Product extends Model {
    static table = 'products';
    static associations = {
        categories: { type: 'belongs_to' as const, key: 'category_id' },
        stores: { type: 'belongs_to' as const, key: 'store_id' },
        inventory: { type: 'has_many' as const, foreignKey: 'product_id' },
    };

    @field('external_id') externalId!: string;
    @field('store_id') storeId!: string;
    @field('category_id') categoryId!: string;
    @text('name') name!: string;
    @text('brand') brand!: string;
    @field('cost') cost!: number;
    @field('barcode') barcode!: string;
    @field('description') description!: string;
    @text('unit') unit!: string;
    @text('quantity_per_unit') quantityPerUnit!: string;
    @text('status') status!: string;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
    @field('deleted') deleted!: boolean;

    @relation('categories', 'category_id') category!: Relation<Category>;
    @relation('stores', 'store_id') store!: Relation<Store>;
    @children('inventory') inventory!: Query<Inventory>;

    @writer async markAsDeleted() {
        await this.update((p) => {
            p.deleted = true;
        });
    }
    @writer async createProductInventory(data: {
        quantity: number;
        costPrice?: number;
        wholeSalePrice?: number;
        sellingPrice?: number;
    }) {
        try {
            console.log('Creating inventory in product model:', this);
            const newInventory = await this.collections
                .get<Inventory>('inventory')
                .create((inventory) => {
                    inventory.product.set(this);
                    inventory.storeId = this.storeId;
                    inventory.quantity = data.quantity;
                    inventory.weightedAvgCost = data.costPrice || 0;
                    inventory.price = data.sellingPrice || 0;
                    inventory.wholeSalePrice = data.wholeSalePrice || 0;
                    inventory.deleted = false;
                });
            console.log('New Inventory:', newInventory);
            return newInventory;
        } catch (error) {
            console.error('Error creating inventory:', error);
            throw error;
        }
    }
}
