import type Business from '@/db/models/business';
import type Store from '@/db/models/stores';
import {
    activeBusinesses$,
    // initSelectedBiz,
    selectedBusiness$,
    selectBusiness as svcSelectBusiness,
} from '@/db/services/businessService';
import {
    activeStores$,
    selectedStore$,
    selectStore as svcSelectStore,
} from '@/db/services/storeService';
import { currentUser$ } from '@/db/services/userService';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BehaviorSubject, Subscription } from 'rxjs';

// Broadcasts business change events so dependent services can reset caches.
export type BusinessChangedPayload = {
    businessId: string | null;
    storeId: string | null;
    reason?: string;
};
export const businessChanged$ = new BehaviorSubject<BusinessChangedPayload | null>(null);

export type BusinessContextValue = {
    selectedBusiness: Business | null;
    selectedStore: Store | null;
    businesses: Business[];
    stores: Store[];
    isLoading: boolean;
    selectBusiness: (id: string | null) => void;
    selectStore: (id: string | null) => void;
    refresh: () => Promise<void>;
};

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined);

export const BusinessProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // initSelectedBiz(currentUser$.);
        const subs: Subscription[] = [];

        // react to the selected business observable
        subs.push(selectedBusiness$.subscribe((b) => setSelectedBusiness(b)));

        // react to the selected store observable
        subs.push(selectedStore$.subscribe((s) => setSelectedStore(s)));

        // update list of businesses for the UI
        subs.push(
            activeBusinesses$.subscribe((list) => {
                setBusinesses(list);
                setIsLoading(false);
            }),
        );

        // update list of active stores (flat list across all businesses)
        subs.push(activeStores$.subscribe((list) => setStores(list)));

        // subscribe to currentUser$ and apply default selection policy
        subs.push(
            currentUser$.subscribe(async (user) => {
                // when user logs out, clear selection
                if (!user) {
                    svcSelectBusiness(null);
                    svcSelectStore(null);
                    businessChanged$.next({
                        businessId: null,
                        storeId: null,
                        reason: 'logout',
                    });
                    return;
                }

                // user logged in: try to pick a default business
                // Strategy: prefer businesses owned by the user, else any active business
                try {
                    // initSelectedBiz(user.externalId);
                    const owned = await user.ownedBusinesses.fetch();

                    owned.forEach((biz) =>
                        console.log(`owned business ${biz.id}  name:${biz.name} }`),
                    );

                    const visible = businesses.filter((b) => !b.deleted);

                    let pickBusiness: Business | null = null;
                    if (owned && owned.length > 0) pickBusiness = owned[0];
                    else if (visible && visible.length > 0) pickBusiness = visible[0];

                    if (pickBusiness) {
                        svcSelectBusiness(pickBusiness.id);
                        // pick the first active store for the business if available
                        const activeStoresForBiz = await pickBusiness.activeStores.fetch();
                        const storePick =
                            activeStoresForBiz && activeStoresForBiz.length > 0
                                ? activeStoresForBiz[0]
                                : null;
                        svcSelectStore(storePick ? storePick.id : null);
                        businessChanged$.next({
                            businessId: pickBusiness.id,
                            storeId: storePick ? storePick.id : null,
                            reason: 'login-or-user-change',
                        });
                    } else {
                        // no business available for this user
                        svcSelectBusiness(null);
                        svcSelectStore(null);
                        businessChanged$.next({
                            businessId: null,
                            storeId: null,
                            reason: 'no-business-available',
                        });
                    }
                } catch (e) {
                    console.log('BusinessContext user subscription error', e);
                }
            }),
        );

        return () => subs.forEach((s) => s.unsubscribe());
    }, [businesses]);
    useEffect(() => {
        console.log(`the selected business ${selectedBusiness?.name} id:${selectedBusiness?.id}`);
        console.log(`the selected store ${selectedStore} id: ${selectedStore?.id}`);
    }, []);

    const selectBusiness = (id: string | null) => {
        svcSelectBusiness(id);
        // businessService will update selectedBusiness$ which we subscribe to above
    };

    const selectStore = (id: string | null) => {
        svcSelectStore(id);
    };

    const refresh = useCallback(async () => {
        // placeholder allowing consumers to trigger a refresh. We can expand later.
        // For now this is a noop that preserves the API.
        setIsLoading(true);
        setIsLoading(false);
    }, []);

    const value = useMemo(
        () => ({
            selectedBusiness,
            selectedStore,
            businesses,
            stores,
            isLoading,
            selectBusiness,
            selectStore,
            refresh,
        }),
        [selectedBusiness, selectedStore, businesses, stores, isLoading, refresh],
    );

    return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};

export const useBusiness = (): BusinessContextValue => {
    const ctx = useContext(BusinessContext);
    if (!ctx) throw new Error('useBusiness must be used within BusinessProvider');
    return ctx;
};

export default BusinessContext;
