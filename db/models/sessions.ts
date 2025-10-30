import { Model, Q, Relation } from '@nozbe/watermelondb';
import { date, field, reader, readonly, relation, writer } from '@nozbe/watermelondb/decorators';
// avoid importing database at module top-level to prevent require cycles
// import { database } from '..';
import type User from './users';

export default class Session extends Model {
    static table = 'sessions';
    static associations = {
        users: { type: 'belongs_to' as const, key: 'user_id' },
    };
    @field('session_id') sessionId!: string;
    @field('user_id') userId!: string;
    @readonly @date('created_at') createdAt!: Date;
    @date('updated_at') updatedAt!: Date;
    @field('is_active') isActive!: boolean;

    // Relations
    @relation('users', 'user_id') user!: Relation<User>;

    // Computed properties
    get isExpired(): boolean {
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        return !this.isActive || Date.now() - this.createdAt.getTime() > expirationTime;
    }

    // Query helpers
    @reader static async findBySessionId(sessionId: string) {
        const { database } = await import('..');
        const sessions = await database
            .get<Session>('sessions')
            .query(Q.where('session_id', sessionId))
            .fetch();
        return sessions[0] || null;
    }

    // Writers
    @writer async deactivate() {
        await this.update((session) => {
            session.isActive = false;
        });
    }
}
