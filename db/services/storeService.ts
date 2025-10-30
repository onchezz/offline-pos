import { StoreData } from '@/types';
import { Q } from '@nozbe/watermelondb';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs/operators';
import { database, storeCollection, userCollection } from '..';
import Store from '../models/stores';
import User from '../models/users';
import { businessCollection } from './businessService';

// Holds the currently selected store id
const selectedStoreId$ = new BehaviorSubject<string | null>(null);

async function initSelectedStore() {
    try {
        const stores = await storeCollection
            .query(Q.where('deleted', false), Q.where('status', 'active'))
            .fetch();
        if (stores.length > 0) selectedStoreId$.next(stores[0].id);
    } catch (e) {
        console.log('storeService init error', e);
        selectedStoreId$.next(null);
    }
}

initSelectedStore();

export const selectedStore$: Observable<Store | null> = selectedStoreId$.pipe(
    switchMap((id) => {
        if (!id) return of(null);
        return storeCollection.findAndObserve(id).pipe(map((s) => (s && s.isActive ? s : null)));
    }),
    distinctUntilChanged((a, b) => a?.id === b?.id),
    shareReplay(1),
);

export const activeStores$: Observable<Store[]> = new Observable<Store[]>((observer) => {
    storeCollection
        .query(Q.where('deleted', false), Q.where('status', 'active'))
        .observe()
        .subscribe(observer);
}).pipe(shareReplay(1));

export async function findStoreById(id: string): Promise<Store | null> {
    try {
        return await storeCollection.find(id);
    } catch {
        return null;
    }
}

export async function createStore(bussinessId: string, data: StoreData) {
    try {
        console.log('creating store with data:', data);

        // First get all the async data we need
        const biz = await businessCollection.find(bussinessId);
        let manager = null;
        if (data.managerId) {
            try {
                manager = await userCollection.find(data.managerId);
            } catch (err) {
                console.log('storeService createStore manager find error:', err);
            }
        }

        // Then create the store with synchronous operations
        const s = await database.write(() => {
            return storeCollection.create((store) => {
                store.externalId = `str_${data.name}${Date.now()}_${Math.random().toString(36).slice(2)}`;
                store.business.set(biz);
                store.name = data.name;
                store.type = data.type || '';
                store.address = data.address || '';
                store.phone = data.phone || '';
                store.email = data.email || '';
                store.description = data.description || '';
                store.weekdayHours = `${data.weekdayOpen || ''}${data.weekdayClose || ''}` || '';
                store.weekendHours = `${data.weekendOpen || ''}${data.weekendClose || ''}` || '';
                store.taxId = data.taxId || '';
                store.establishedYear = data.establishedYear || '';
                if (manager) {
                    store.manager.set(manager);
                }
                store.currency = data.currency || 'Kes';
                store.timezone = data.timezone || 'Africa/Nairobi';
                store.logoUrl = data.logoEmoji || '';
                store.receiptFooter = data.receiptFooter || '';
                store.wholesaleEnabled = !!data.wholesaleEnabled;
                store.status = data.status || 'active';
                store.deleted = false;
            });
        });
        console.log('created store:', s.name);
        selectedStoreId$.next(s.id);
        return s;
    } catch (e) {
        console.log('createStore error', e);
        return null;
    }
}

export async function updateStore(
    id: string,
    patch: Partial<{
        name: string;
        type: string;
        address: string;
        phone: string;
        email: string;
        description: string;
        weekdayHours: string;
        weekendHours: string;
        taxId: string;
        establishedYear: string;
        managerId: string;
        currency: string;
        timezone: string;
        logoUrl: string;
        receiptFooter: string;
        wholesaleEnabled: boolean;
        status: string;
        deleted: boolean;
    }>,
) {
    const s = await findStoreById(id);
    if (!s) throw new Error('Store not found');

    let manager: User | null = null;
    if (patch.managerId) {
        try {
            const foundManager = await userCollection.find(patch.managerId);
            if (foundManager) manager = foundManager;
        } catch (err) {
            console.log('storeService updateStore manager find error:', err);
        }
    }

    await database.write(async () => {
        await s.update((row) => {
            if (patch.name !== undefined) row.name = patch.name;
            if (patch.type !== undefined) row.type = patch.type;
            if (patch.address !== undefined) row.address = patch.address;
            if (patch.phone !== undefined) row.phone = patch.phone;
            if (patch.email !== undefined) row.email = patch.email;
            if (patch.description !== undefined) row.description = patch.description;
            if (patch.weekdayHours !== undefined) row.weekdayHours = patch.weekdayHours;
            if (patch.weekendHours !== undefined) row.weekendHours = patch.weekendHours;
            if (patch.taxId !== undefined) row.taxId = patch.taxId;
            if (patch.establishedYear !== undefined) row.establishedYear = patch.establishedYear;
            if (patch.managerId !== undefined && manager) row.manager.set(manager);
            if (patch.currency !== undefined) row.currency = patch.currency;
            if (patch.timezone !== undefined) row.timezone = patch.timezone;
            if (patch.logoUrl !== undefined) row.logoUrl = patch.logoUrl;
            if (patch.receiptFooter !== undefined) row.receiptFooter = patch.receiptFooter;
            if (patch.wholesaleEnabled !== undefined)
                row.wholesaleEnabled = !!patch.wholesaleEnabled;
            if (patch.status !== undefined) row.status = patch.status;
            if (patch.deleted !== undefined) row.deleted = !!patch.deleted;
        });
    });
}

export async function markStoreDeleted(id: string) {
    await updateStore(id, { deleted: true, status: 'inactive' });
    if (selectedStoreId$.value === id) selectedStoreId$.next(null);
}

export function selectStore(id: string | null) {
    selectedStoreId$.next(id);
}

export async function findByExternalId(externalId: string) {
    const list = await storeCollection
        .query(Q.where('external_id', externalId), Q.where('deleted', false))
        .fetch();
    return list[0] || null;
}

export const storeService = {
    selectedStore$,
    activeStores$,
    selectStore,
    findStoreById,
    createStore,
    updateStore,
    markStoreDeleted,
    findByExternalId,
    // New functions for multi-business/store management
    async getStoresForBusiness(businessId: string): Promise<Store[]> {
        return await storeCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.where('status', 'active'),
            )
            .fetch();
    },

    async getActiveStoresCount(businessId: string): Promise<number> {
        const stores = await storeCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.where('status', 'active'),
            )
            .fetch();
        return stores.length;
    },

    async switchToStore(storeId: string): Promise<boolean> {
        try {
            const store = await findStoreById(storeId);
            if (store && store.isActive) {
                selectStore(storeId);
                return true;
            }
            return false;
        } catch (e) {
            console.log('switchToStore error:', e);
            return false;
        }
    },

    async getFirstActiveStore(businessId: string): Promise<Store | null> {
        const stores = await storeCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.where('status', 'active'),
            )
            .fetch();
        return stores[0] || null;
    },
};

export default storeService;
