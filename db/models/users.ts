import { Model, Q, Query } from '@nozbe/watermelondb';
import {
    children,
    date,
    field,
    lazy,
    reader,
    readonly,
    text,
    writer,
} from '@nozbe/watermelondb/decorators';
import Business from './business';
import Session from './sessions';
import Store from './stores';

export default class User extends Model {
    static table = 'users';
    static associations = {
        sessions: { type: 'has_many' as const, foreignKey: 'user_id' },
        businesses: { type: 'has_many' as const, foreignKey: 'owner_id' },
        managed_stores: { type: 'has_many' as const, foreignKey: 'manager_id' },
    };

    @field('external_id') externalId!: string;
    @text('email') email!: string;
    @text('name') name!: string;
    @text('phone') phone!: string;
    @text('password_hash') passwordHash!: string;
    @text('pin_hash') pinHash!: string;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
    @field('deleted') deleted!: boolean;
    @field('is_owner') isOwner!: boolean;

    // Relations
    @children('sessions') sessions!: Query<Session>;
    @children('businesses') ownedBusinesses!: Query<Business>;
    @children('stores') managedStores!: Query<Store>;

    // Computed properties
    get isActive(): boolean {
        return !this.deleted;
    }

    get fullName(): string {
        return this.name;
    }
    @lazy ownerActiveBusinesses = this.ownedBusinesses.extend(Q.where('deleted', false));
    @lazy activeManagedStores = this.managedStores.extend(
        Q.where('deleted', false),
        Q.where('status', 'active'),
    );
    // Writers
    @writer async markAsDeleted() {
        await this.update((user) => {
            user.deleted = true;
        });
    }
    @reader async getUserById(userId: string) {
        const users = await this.collections
            .get<User>('users')
            .query(Q.where('id', userId), Q.where('deleted', false))
            .fetch();
        return users[0];
    }
}
