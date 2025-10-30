import Role from '@/db/models/roles';
import Staff from '@/db/models/staff';
import User from '@/db/models/users';
import { Permission } from '@/types';
import { Q } from '@nozbe/watermelondb';
import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import {
    businessCollection,
    database,
    roleCollection,
    staffCollection,
    storeCollection,
    userCollection,
} from '..';
import { selectedStore$ } from './storeService';
import { currentUser$ } from './userService';

async function getRolesForBusiness(businessId: string) {
    try {
        const list = await roleCollection
            .query(Q.where('business_id', businessId), Q.where('deleted', false))
            .fetch();
        return list as Role[];
    } catch (e) {
        console.error('getRolesForBusiness error', e);
        return [] as Role[];
    }
}
/**
 * Return all staff records for a given store (not deleted).
 */
async function getStaffForStore(storeId: string) {
    try {
        const list = await staffCollection
            .query(Q.where('store_id', storeId), Q.where('deleted', false))
            .fetch();
        return list as Staff[];
    } catch (e) {
        console.error('getStaffForStore error', e);
        return [] as Staff[];
    }
}

/**
 * Return all staff records across all stores (not deleted).
 */
async function getAllStaffs() {
    try {
        const list = await staffCollection.query(Q.where('deleted', false)).fetch();
        return list as Staff[];
    } catch (e) {
        console.error('getAllStaffs error', e);
        return [] as Staff[];
    }
}
async function createRole(data: {
    name: string;
    permissions?: Permission[];
    storeId: string;
    businessId: string;
}) {
    try {
        // Try to find an existing role with the same name scoped to the business
        // and optionally the same store. This makes creation idempotent.
        const whereClauses: any[] = [
            Q.where('business_id', data.businessId),
            Q.where('name', data.name),
        ];
        if (data.storeId) whereClauses.push(Q.where('store_id', data.storeId));

        const existing = await roleCollection
            .query(...whereClauses, Q.where('deleted', false))
            .fetch();
        if (existing && existing.length > 0) {
            return existing[0] as Role;
        }

        const businessModel = await businessCollection.find(data.businessId).catch(() => null);
        let storeModel = null;
        if (data.storeId) {
            storeModel = await storeCollection.find(data.storeId).catch(() => null);
        }

        const role = await database.write(async () => {
            return await roleCollection.create((r) => {
                r.externalId = `role_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                r.name = data.name;
                r.permissions = JSON.stringify(data.permissions || []);
                r.deleted = false;
                if (businessModel) {
                    r.business.set(businessModel);
                }
                if (storeModel) {
                    r.store.set(storeModel);
                }
            });
        });
        return role;
    } catch (e) {
        throw new Error(`createRole failed: ${e}`);
    }
}

async function updateRole(
    roleId: string,
    patch: Partial<{ name: string; permissions: string[]; deleted: boolean }>,
) {
    try {
        const r = await roleCollection.find(roleId);
        if (!r) throw new Error('Role not found');
        await database.write(async () => {
            await r.update((row) => {
                if (patch.name !== undefined) row.name = patch.name;
                if (patch.permissions !== undefined)
                    row.permissions = JSON.stringify(patch.permissions);
                if (patch.deleted !== undefined) row.deleted = !!patch.deleted;
            });
        });
        return r;
    } catch (e) {
        throw new Error(`updateRole failed: ${e}`);
    }
}

async function assignStaff(userId: string, storeId: string, roleId: string) {
    try {
        const userModel = await userCollection.find(userId).catch(() => null);
        const storeModel = await storeCollection.find(storeId).catch(() => null);
        const roleModel = await roleCollection.find(roleId).catch(() => null);
        const staff = await database.write(async () => {
            return await staffCollection.create((s) => {
                s.externalId = `stf_${Date.now()}_${Math.random().toString(36).slice(2)}`;
                s.deleted = false;
                if (userModel) {
                    s.user.set(userModel);
                }
                if (storeModel) {
                    s.store.set(storeModel);
                }
                if (roleModel) {
                    s.role.set(roleModel);
                }
            });
        });
        return staff as Staff;
    } catch (e) {
        throw new Error(`assignStaff failed: ${e}`);
    }
}

/**
 * Create or update the staff record for a user in a store to set the given role.
 * If a staff record exists for (userId, storeId) it will be updated, otherwise created.
 */
/**
 * (Implementation below uses getStaffForUserInStore / assignStaff.)
 */

async function updateStaffRole(userId: string, storeId: string, roleId: string) {
    try {
        const existing = await getStaffForUserInStore(userId, storeId);
        const roleModel = await roleCollection.find(roleId).catch(() => null);
        if (!roleModel) throw new Error('Role not found');

        if (existing) {
            await database.write(async () => {
                await existing.update((s) => {
                    s.role.set(roleModel);
                });
            });
            return existing as Staff;
        }

        // if no existing staff, create one
        return await assignStaff(userId, storeId, roleId);
    } catch (e) {
        throw new Error(`updateStaffRole failed: ${e}`);
    }
}

/**
 * Observable that resolves the current user's Staff record for the selected store (if any).
 */
const currentStaff$: Observable<Staff | null> = combineLatest([currentUser$, selectedStore$]).pipe(
    switchMap(([user, store]) => {
        if (!user || !store) return of(null);
        return staffCollection
            .query(
                Q.where('user_id', user.id),
                Q.where('store_id', store.id),
                Q.where('deleted', false),
            )
            .observe()
            .pipe(map((list: Staff[]) => (list && list.length > 0 ? list[0] : null)));
    }),
    distinctUntilChanged((a, b) => a?.id === b?.id),
    shareReplay(1),
);

// Observable for all roles (business-wide)
export const roles$: Observable<Role[]> = roleCollection
    .query(Q.where('deleted', false))
    .observe()
    .pipe(
        map((list: any) => list as Role[]),
        shareReplay(1),
    );

// Observable for staff changes across the DB
export const staffs$: Observable<Staff[]> = staffCollection
    .query(Q.where('deleted', false))
    .observe()
    .pipe(
        map((list: any) => list as Staff[]),
        shareReplay(1),
    );

/**
 * Return roles for a business along with a count of staff assigned to each role.
 */
async function getRolesWithUserCounts(storeId: string) {
    try {
        const roles = await roleCollection
            .query(Q.where('store_id', storeId), Q.where('deleted', false))
            .fetch();

        const results: { role: Role; userCount: number }[] = [];
        for (const r of roles) {
            const staff = await staffCollection
                .query(Q.where('role_id', r.id), Q.where('deleted', false))
                .fetch();
            results.push({ role: r, userCount: staff.length });
        }
        return results;
    } catch (e) {
        console.error('getRolesWithUserCounts error', e);
        return [] as { role: Role; userCount: number }[];
    }
}

/**
 * Return users that are not yet assigned as staff for the given store.
 */
async function getAvailableUsersForStore(storeId: string) {
    try {
        // fetch all non-deleted users
        const users = await userCollection.query(Q.where('deleted', false)).fetch();

        // fetch staff assigned to this store
        const staff = await staffCollection
            .query(Q.where('store_id', storeId), Q.where('deleted', false))
            .fetch();

        const staffUserIds = new Set(staff.map((s) => s.userId));

        // filter users not in staffUserIds
        const available = users.filter((u) => !staffUserIds.has(u.id));
        return available;
    } catch (e) {
        console.error('getAvailableUsersForStore error', e);
        return [] as User[];
    }
}

/**
 * Find a staff record for a user in a particular store (not deleted).
 */
async function getStaffForUserInStore(userId: string, storeId: string): Promise<Staff | null> {
    try {
        const list = await staffCollection
            .query(
                Q.where('user_id', userId),
                Q.where('store_id', storeId),
                Q.where('deleted', false),
            )
            .fetch();
        return list[0] || null;
    } catch (e) {
        console.error('getStaffForUserInStore error', e);
        return null;
    }
}

/**
 * Return the effective permission names for a user in a store (parsed from role.permissions JSON).
 */
async function getUserPermissionsForStore(
    userId: string,
    storeId: string,
): Promise<{ role: string; permissions: string[] }> {
    const emptyRole = { role: '', permissions: [] };
    try {
        const staff = await getStaffForUserInStore(userId, storeId);
        if (!staff) return emptyRole;
        try {
            const roleModel = await roleCollection.find(staff.roleId);
            if (!roleModel) return emptyRole;
            const perms = roleModel.permissions || '[]';
            const parsed = JSON.parse(perms);
            const staffRole = {
                role: roleModel.name,
                permissions: Array.isArray(parsed) ? parsed : [],
            };
            return staffRole;
        } catch (e) {
            console.error(
                'getUserPermissionsForStore: failed to load role or parse permissions',
                e,
            );
            return emptyRole;
        }
    } catch (e) {
        console.error('getUserPermissionsForStore error', e);
        return emptyRole;
    }
}

async function getRoleById(roleId: string): Promise<Role | null> {
    try {
        const r = await roleCollection.find(roleId);
        return r || null;
    } catch (e) {
        console.error('getRoleById error', e);
        return null;
    }
}

export const RoleService = {
    getRolesForBusiness,
    createRole,
    updateRole,
    assignStaff,
    getStaffForUserInStore,
    getUserPermissionsForStore,
    getRoleById,
    currentStaff$,
    getRolesWithUserCounts,
    getAvailableUsersForStore,
    getStaffForStore,
    getAllStaffs,
    updateStaffRole,
};

export default RoleService;
