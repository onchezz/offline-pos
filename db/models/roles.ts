import { Model, Relation } from '@nozbe/watermelondb';
import { field, relation, text, writer } from '@nozbe/watermelondb/decorators';
import Business from './business';
import Store from './stores';

export default class Role extends Model {
    static table = 'roles';
    static associations = {
        businesses: { type: 'belongs_to' as const, key: 'business_id' },
        stores: { type: 'belongs_to' as const, key: 'store_id' },
    };

    @field('external_id') externalId!: string;
    @text('name') name!: string;
    @field('permissions') permissions!: string;
    @field('deleted') deleted!: boolean;
    @field('store_id') storeId?: string;
    @relation('businesses', 'business_id') business!: Relation<Business>;
    @relation('stores', 'store_id') store!: Relation<Store>;

    /**
     * Return permissions as an array of strings parsed from the stored JSON.
     */
    get permissionsList(): string[] {
        try {
            const p = this.permissions || '[]';
            const parsed = JSON.parse(p);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    @writer async setPermissions(list: string[]) {
        await this.update((r) => {
            r.permissions = JSON.stringify(list || []);
        });
    }

    @writer async markAsDeleted() {
        await this.update((r) => {
            r.deleted = true;
        });
    }
}
