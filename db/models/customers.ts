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
import Business from './business';
import Sale from './sales';
import Store from './stores';

export default class Customer extends Model {
    static table = 'customers';
    static associations = {
        sales: { type: 'has_many' as const, foreignKey: 'customer_id' },
    };

    @field('external_id') externalId!: string;
    @field('business_id') businessId!: string;
    @field('store_id') storeId!: string;
    @text('name') name!: string;
    @text('phone') phone!: string;
    @text('email') email!: string;
    @field('credit_limit') creditLimit!: number;
    @field('current_balance') currentBalance!: number;
    @field('reputation_score') reputationScore!: number;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
    @field('deleted') deleted!: boolean;

    @relation('businesses', 'business_id') business!: Relation<Business>;
    @relation('stores', 'store_id') store!: Relation<Store>;
    @children('sales') sales!: Query<Sale>;

    @writer async markAsDeleted() {
        await this.update((c) => {
            c.deleted = true;
        });
    }
}
