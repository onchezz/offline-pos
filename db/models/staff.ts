import { Model, Relation } from '@nozbe/watermelondb';
import { date, field, readonly, relation, writer } from '@nozbe/watermelondb/decorators';
import User from './users';
import Store from './stores';
import Role from './roles';

export default class Staff extends Model {
    static table = 'staff';
    static associations = {
        users: { type: 'belongs_to' as const, key: 'user_id' },
        stores: { type: 'belongs_to' as const, key: 'store_id' },
        roles: { type: 'belongs_to' as const, key: 'role_id' },
    };

    @field('external_id') externalId!: string;
    @field('user_id') userId!: string;
    @field('store_id') storeId!: string;
    @field('role_id') roleId!: string;
    @readonly @date('assigned_at') assignedAt!: Date;
    @field('deleted') deleted!: boolean;

    @relation('users', 'user_id') user!: Relation<User>;
    @relation('stores', 'store_id') store!: Relation<Store>;
    @relation('roles', 'role_id') role!: Relation<Role>;

    @writer async markAsDeleted() {
        await this.update((s) => {
            s.deleted = true;
        });
    }
}
