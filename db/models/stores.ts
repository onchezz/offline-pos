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
// Avoid importing collections/services from the DB index at module scope to prevent
// circular require cycles. Use `this.collections.get(...)` and local queries inside
// model methods instead.
import type Business from './business';
import Inventory from './inventory';
import Product from './products';
import Sale from './sales';
import type User from './users';

export default class Store extends Model {
    static table = 'stores';
    static associations = {
        businesses: { type: 'belongs_to' as const, key: 'business_id' },
        users: { type: 'belongs_to' as const, key: 'manager_id' },
        products: { type: 'has_many' as const, foreignKey: 'store_id' },
        inventory: { type: 'has_many' as const, foreignKey: 'store_id' },
        sales: { type: 'has_many' as const, foreignKey: 'store_id' },
    };

    @field('external_id') externalId!: string;
    @text('name') name!: string;
    @text('type') type!: string;
    @text('address') address!: string;
    @text('phone') phone!: string;
    @text('email') email!: string;
    @text('description') description!: string;
    @text('weekday_hours') weekdayHours!: string;
    @text('weekend_hours') weekendHours!: string;
    @text('tax_id') taxId!: string;
    @text('established_year') establishedYear!: string;
    @text('status') status!: string;
    @text('currency') currency!: string;
    @text('timezone') timezone!: string;
    @text('logo_url') logoUrl!: string;
    @text('receipt_footer') receiptFooter!: string;
    @field('wholesale_enabled') wholesaleEnabled!: boolean;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
    @field('deleted') deleted!: boolean;

    // Relations
    @relation('businesses', 'business_id') business!: Relation<Business>;
    @relation('users', 'manager_id') manager!: Relation<User>;
    @children('products') products!: Query<Product>;
    @children('inventory') inventories!: Relation<Inventory>;
    @children('sales') sales!: Relation<Sale>; // Replace 'any' with actual Sale model when defined

    // Computed properties
    get isActive(): boolean {
        return this.status === 'active' && !this.deleted;
    }

    get displayName(): string {
        return this.name;
    }

    // Writers
    @writer async markAsDeleted() {
        await this.update((store) => {
            store.deleted = true;
        });
    }

    @writer async updateStatus(status: string) {
        await this.update((store) => {
            store.status = status;
        });
    }
    // @writer async updateStoreDetails(
    //     updates: Partial<{
    //         name: string;
    //         type: string;
    //         address: string;
    //         phone: string;
    //         email: string;
    //         description: string;
    //         weekdayHours: string;
    //         weekendHours: string;
    //         taxId: string;
    //         establishedYear: string;
    //         currency: string;
    //         timezone: string;
    //         logoUrl: string;
    //         receiptFooter: string;
    //         status: string;
    //     }>,
    // ) {
    //     await this.update((store) => {
    //         if (updates.name !== undefined) store.name = updates.name;
    //         if (updates.type !== undefined) store.type = updates.type;
    //         if (updates.address !== undefined) store.address = updates.address;
    //         if (updates.phone !== undefined) store.phone = updates.phone;
    //         if (updates.email !== undefined) store.email = updates.email;
    //         if (updates.description !== undefined) store.description = updates.description;
    //         if (updates.weekdayHours !== undefined) store.weekdayHours = updates.weekdayHours;
    //         if (updates.weekendHours !== undefined) store.weekendHours = updates.weekendHours;
    //         if (updates.taxId !== undefined) store.taxId = updates.taxId;
    //         if (updates.establishedYear !== undefined)
    //             store.establishedYear = updates.establishedYear;
    //         if (updates.currency !== undefined) store.currency = updates.currency;
    //         if (updates.timezone !== undefined) store.timezone = updates.timezone;
    //         if (updates.logoUrl !== undefined) store.logoUrl = updates.logoUrl;
    //         if (updates.receiptFooter !== undefined) store.receiptFooter = updates.receiptFooter;
    //         if (updates.status !== undefined) store.status = updates.status;
    //     });
    // }
    // @writer async createProduct(data: ProductData, invent: InventoryItemData) {
    //     try {
    //         console.log('Creating product in store model:', this);
    //         const newProduct = await this.collections.get<Product>('products').create((product) => {
    //             product.store.set(this);
    //             product.externalId = `prod_${Date.now()}`;
    //             product.storeId = this.id || data.storeId;
    //             product.categoryId = data.categoryId;
    //             product.name = data.name;
    //             product.barcode = data.barcode || '';
    //             product.description = data.description || '';
    //             product.unit = data.unit || '';
    //             product.status = data.status || 'active';
    //             product.deleted = false;
    //         });

    //         const productinv = await this.callWriter(async () => {
    //             const productinv = await newProduct.createProductInventory({
    //                 quantity: invent.quantity || 0,
    //                 costPrice: invent.lastPurchasePrice || 0,
    //                 wholeSalePrice: invent.wholeSalePrice || 0,
    //                 sellingPrice: invent?.price || 0,
    //             });
    //             return productinv;
    //         });

    //         return { product: newProduct, productInventory: productinv };
    //     } catch (error) {
    //         console.warn('error creating user ', error);
    //     }
    // }
}
