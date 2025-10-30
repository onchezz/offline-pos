import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import RoleSvc from '@/db/services/roleService';
import * as UserService from '@/db/services/userService';
import useStaff from '@/hooks/useStaffs';
import { UserProfileData } from '@/types';
import { useCallback, useMemo, useState } from 'react';

type UseProfileReturn = {
    profile: UserProfileData | null;
    externalId?: string | null;
    loading: boolean;
    refresh: () => Promise<void>;
    updateProfile: (data: Partial<UserProfileData>) => Promise<boolean>;
    availableRoles: { id: string; name: string }[];
};

export default function useProfile(): UseProfileReturn {
    const { user } = useAuth();
    const { selectedStore, selectedBusiness } = useBusiness();
    const staffHook = useStaff();
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        await staffHook.refresh();
    }, [staffHook]);

    const profile = useMemo((): UserProfileData | null => {
        if (!user) return null;

        // Prefer enriched activeUser from staffHook when available
        const active = staffHook.activeUser;
        if (active && active.id === user.id) return active;

        // Fallback: build profile from auth user model
        const name = user.name || '';
        const parts = name.split(' ');
        const firstName = parts.shift() || '';
        const lastName = parts.join(' ');

        // try to find a role from the mapped users in staffHook
        const mapped = staffHook.users.find((u) => u.id === user.id);
        const roleName = mapped?.role || '';

        return {
            id: user.id,
            firstName,
            lastName,
            role: roleName,
            email: user.email || '',
            phone: user.phone || '',
            emergencyContact: '',
            joinDate: '',
            permissions: active?.permissions || [],
        };
    }, [user, staffHook.activeUser, staffHook.users]);

    const updateProfile = useCallback(
        async (data: Partial<UserProfileData>) => {
            if (!user) return false;
            setLoading(true);
            try {
                // Update core user fields
                const patch: Partial<{ name: string; email: string; phone: string }> = {};
                if (data.firstName !== undefined || data.lastName !== undefined) {
                    const fn = data.firstName || '';
                    const ln = data.lastName || '';
                    patch.name = `${fn} ${ln}`.trim();
                }
                if (data.email !== undefined) patch.email = data.email;
                if (data.phone !== undefined) patch.phone = data.phone;

                if (Object.keys(patch).length > 0) {
                    await UserService.updateUser(user.id, patch);
                }

                // handle role change (if requested)
                if (data.role !== undefined && selectedBusiness && selectedStore) {
                    // find role model by name scoped to business
                    const roles = await RoleSvc.getRolesForBusiness(selectedBusiness.id);
                    const found = roles.find((r) => r.name === data.role);
                    if (found) {
                        // Use role service helper to update staff record (created/updated)
                        // RoleSvc.updateStaffRole will create or update a staff record.
                        await RoleSvc.updateStaffRole(user.id, selectedStore.id, found.id);
                    }
                }

                // refresh the staff hook so UI picks up new role/permissions
                await staffHook.refresh();
                setLoading(false);
                return true;
            } catch (e) {
                console.error('useProfile.updateProfile error', e);
                setLoading(false);
                return false;
            }
        },
        [user, selectedBusiness, selectedStore, staffHook],
    );

    return {
        profile,
        externalId: (user as any)?.externalId || null,
        loading,
        refresh,
        updateProfile,
        availableRoles: staffHook.roles.map((r) => ({ id: String(r.id), name: r.name })),
    };
}
