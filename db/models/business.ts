import { Model, Q, Query, Relation } from '@nozbe/watermelondb';
import {
    children,
    date,
    field,
    lazy,
    reader,
    readonly,
    relation,
    writer,
} from '@nozbe/watermelondb/decorators';
// avoid importing database at module top-level to prevent require cycles
// import { database } from '..';
import type Store from './stores';
import type User from './users';

export default class Business extends Model {
    static table = 'businesses';
    static associations = {
        users: { type: 'belongs_to' as const, key: 'owner_id' },
        stores: { type: 'has_many' as const, foreignKey: 'business_id' },
    };

    @field('external_id') externalId!: string;
    @field('name') name!: string;
    @field('business_type') businessType!: string;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
    @field('deleted') deleted!: boolean;

    // Relations
    @relation('users', 'owner_id') owner!: Relation<User>;
    @children('stores') stores!: Query<Store>;

    // Computed properties
    get isActive(): boolean {
        return !this.deleted;
    }

    get displayName(): string {
        return this.name;
    }

    // Custom Queries
    @lazy activeStores = this.stores.extend(Q.where('deleted', false), Q.where('status', 'active'));

    // Query helpers
    @reader static async findByExternalId(externalId: string) {
        // lazy import to avoid require cycles
        const { database } = await import('..');
        const businesses = await database
            .get<Business>('businesses')
            .query(Q.where('external_id', externalId), Q.where('deleted', false))
            .fetch();
        return businesses[0] || null;
    }

    // Writers
    @writer async markAsDeleted() {
        await this.update((business) => {
            business.deleted = true;
        });
    }
}
