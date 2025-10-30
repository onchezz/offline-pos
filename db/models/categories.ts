import { Model, Query } from '@nozbe/watermelondb';
import { children, date, field, text, writer } from '@nozbe/watermelondb/decorators';
import Product from './products';

export default class Category extends Model {
    static table = 'categories';
    static associations = {
        products: { type: 'has_many' as const, foreignKey: 'category_id' },
    };

    @field('external_id') externalId!: string;
    @field('business_id') businessId!: string;
    @field('store_id') storeId!: string;
    @text('name') name!: string;
    @text('icon') icon!: string;
    @text('color') color!: string;
    @date('created_at') createdAt!: Date;
    @field('deleted') deleted!: boolean;

    @children('products') products!: Query<Product>;

    @writer async markAsDeleted() {
        await this.update((c) => {
            c.deleted = true;
        });
    }
}
