import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import Role from '@/db/models/roles';
import RoleSvc, { roles$, staffs$ } from '@/db/services/roleService';
import * as SessionsService from '@/db/services/sessionsService';
import * as UserService from '@/db/services/userService';
import { Permission, RoleWithUserCount, User, UserData, UserProfileData } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

type UseUsersHook = {
    users: User[];
    activeUser: UserProfileData | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    roles: RoleWithUserCount[];
    createUser: (data: UserData) => Promise<string>;
    createRole: (data: { name: string; permissions: Permission[] }) => Promise<Role | undefined>;
    update: (
        id: string,
        patch: Partial<{ name: string; email: string; phone: string }>,
    ) => Promise<void>;
    assignRoleToUser: (userId: string, roleId: string) => Promise<void>;
};

export default function useStaff(): UseUsersHook {
    const [users, setUsers] = useState<User[]>([]);
    const [activeUser, setActiveUser] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedStore, selectedBusiness } = useBusiness();
    const { user: currentUser } = useAuth();
    // Roles state and loader
    const [roles, setRoles] = useState<RoleWithUserCount[]>([]);

    // Single effect: observe users, staff, roles and sessions and recompute derived state
    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            // use service APIs instead of accessing collections directly
            const [userList, sessions, staffList, roleModels] = await Promise.all([
                UserService.getUsers(),
                SessionsService.getAllSessionsOrdered(),
                selectedStore ? RoleSvc.getStaffForStore(selectedStore.id) : RoleSvc.getAllStaffs(),
                // fetch roles for business (service returns business-scoped roles)
                selectedBusiness
                    ? RoleSvc.getRolesForBusiness(selectedBusiness.id)
                    : Promise.resolve([] as Role[]),
            ]);

            // build roleId -> roleName map
            const roleIdName: Record<string, string> = {};
            for (const r of roleModels) roleIdName[r.id] = r.name;

            // build staff map userId -> roleName and role userCounts
            const staffMapLocal: Record<string, string> = {};
            const roleCounts: Record<string, number> = {};
            for (const s of staffList) {
                const roleName = roleIdName[s.roleId] || '';
                staffMapLocal[s.userId] = roleName;
                roleCounts[s.roleId] = (roleCounts[s.roleId] || 0) + 1;
            }

            // build roles[] with userCount
            const mappedRoles: RoleWithUserCount[] = roleModels.map((r: any, idx: number) => ({
                id: parseInt(r.id) || idx,
                name: r.name,
                userCount: roleCounts[r.id] || 0,
                permissions: (() => {
                    try {
                        const p = JSON.parse(r.permissions || '[]');
                        return Array.isArray(p) ? p : [];
                    } catch {
                        return [];
                    }
                })(),
            }));

            // build last-login map
            const lastMap: Record<string, Date> = {};
            for (const s of sessions) {
                if (!lastMap[s.userId]) lastMap[s.userId] = s.updatedAt || s.createdAt;
            }

            const mappedUsers: User[] = userList.map((m: any) => {
                const lastDate: Date | undefined = lastMap[m.id];
                const lastLogin = lastDate
                    ? lastDate.toLocaleString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                      })
                    : undefined;

                return {
                    externalId: m.externalId,
                    id: m.id,
                    name: m.name,
                    email: m.email,
                    lastLogin,
                    role: staffMapLocal[m.id] || '',
                    phoneNumber: m.phone || '',
                } as User;
            });

            // staffMapLocal is computed and used to build users; no separate state needed
            setRoles(mappedRoles);
            setUsers(mappedUsers);

            // compute permissions for the currently authenticated user (if any)
            try {
                if (currentUser && selectedStore) {
                    const role = await RoleSvc.getUserPermissionsForStore(
                        currentUser.id,
                        selectedStore.id,
                    );
                    // Build an explicit UserProfileData object from the current user
                    const nameParts = (currentUser.name || '').split(' ');
                    const firstName = nameParts.shift() || '';
                    const lastName = nameParts.join(' ');
                    const profile: UserProfileData = {
                        id: currentUser.id,
                        firstName,
                        lastName,
                        role: role.role, // role will be derived elsewhere if needed
                        email: currentUser.email || '',
                        phone: currentUser.phone || '',
                        emergencyContact: currentUser.phone,
                        joinDate: currentUser.createdAt.toLocaleDateString(),
                        permissions: role.permissions,
                    };
                    setActiveUser(profile);
                } else if (currentUser) {
                    // currentUser exists but no selected store -> empty permissions
                    const nameParts = (currentUser.name || '').split(' ');
                    const firstName = nameParts.shift() || '';
                    const lastName = nameParts.join(' ');
                    const profile: UserProfileData = {
                        id: currentUser.id,
                        firstName,
                        lastName,
                        role: '',
                        email: currentUser.email || '',
                        phone: currentUser.phone || '',
                        emergencyContact: '',
                        joinDate: '',
                        permissions: [],
                    };
                    setActiveUser(profile);
                } else {
                    setActiveUser(null);
                }
            } catch (err) {
                console.error('failed to compute current user permissions', err);
            }

            try {
                const currentUserWithPermission = mappedUsers.find((user) => {
                    if (!currentUser) {
                        Toast.show({
                            type: 'error',
                            text1: 'Error',
                            text2: 'No active User',
                            position: 'top',
                        });
                        return;
                    }

                    return user.id === currentUser.id;
                });
                console.log(currentUserWithPermission);
            } catch {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Failed to get uses with permissions',
                    position: 'top',
                });
            }
        } catch (e: any) {
            console.error('useUsers.refresh error', e);
            setError(String(e));
        } finally {
            setLoading(false);
        }
    }, [currentUser, selectedStore, selectedBusiness]);

    useEffect(() => {
        let mounted = true;
        // subscribe to service observables; any change triggers recompute
        const usersSub = UserService.users$.subscribe(() => {
            if (mounted) refresh();
        });
        const staffSub = staffs$.subscribe(() => {
            if (mounted) refresh();
        });
        const rolesSub = roles$.subscribe(() => {
            if (mounted) refresh();
        });
        const sessionsSub = SessionsService.sessions$.subscribe(() => {
            if (mounted) refresh();
        });

        // initial load
        refresh();

        return () => {
            mounted = false;
            try {
                usersSub.unsubscribe();
                staffSub.unsubscribe();
                rolesSub.unsubscribe();
                sessionsSub.unsubscribe();
            } catch {}
        };
    }, [refresh]);

    const createUser = async (data: UserData) => {
        setLoading(true);
        try {
            const userModel = await UserService.createUser(data);
            await refresh();
            setLoading(false);
            return userModel.id;
        } catch (e: any) {
            console.error('useUsers.create error', e);
            setError(String(e));
            throw e;
        }
    };

    const update = async (
        id: string,
        patch: Partial<{ name: string; email: string; phone: string }>,
    ) => {
        setLoading(true);
        try {
            await UserService.updateUser(id, patch);
            await refresh();
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.error('useUsers.update error', e);
            setError(String(e));
            throw e;
        }
    };

    const assignRoleToUser = async (userId: string, roleId: string) => {
        if (!selectedStore) throw new Error('No store selected');
        try {
            await RoleSvc.assignStaff(userId, selectedStore.id, roleId);
            await refresh();
        } catch (e: any) {
            console.error('useUsers.assignRoleToUser error', e);
            setError(String(e));
            throw e;
        }
    };

    const createRole = async (data: { name: string; permissions: Permission[] }) => {
        if (!selectedBusiness || !selectedStore) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Business or Store not selected',
                position: 'top',
            });
            return;
        }
        try {
            const role = await RoleSvc.createRole({
                name: data.name,
                permissions: data.permissions,
                storeId: selectedStore.id,
                businessId: selectedBusiness.id,
            });
            await refresh();
            return role;
        } catch (e: any) {
            console.error('useUsers.createRole error', e);
            setError(String(e));
            throw e;
        }
    };

    return {
        users,
        activeUser,
        loading,
        error,
        refresh,
        createUser,
        createRole,
        update,
        assignRoleToUser,
        roles,

        // no separate getRoles exported; use `refresh` to reload everything
    };
}
