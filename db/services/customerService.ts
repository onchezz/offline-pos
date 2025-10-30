import capitalizeName from '@/utils/wordCapitlization';
import { Q } from '@nozbe/watermelondb';
import { map, shareReplay } from 'rxjs/operators';
import { customersCollection, database } from '..';

export const customerService = {
    async findOrCreateCustomer(data: {
        businessId: string;
        storeId?: string;
        name?: string;
        phone?: string;
        email?: string;
        creditLimit?: number;
    }) {
        const searchPhone = data.phone?.trim();
        const searchEmail = data.email?.trim();

        if (searchPhone) {
            // prefer matching by store_id when provided, otherwise fallback to business scope
            const whereClauses = [Q.where('phone', searchPhone), Q.where('deleted', false)];
            if (data.storeId) whereClauses.unshift(Q.where('store_id', data.storeId));
            else whereClauses.unshift(Q.where('business_id', data.businessId));

            const existingCustomer = await customersCollection.query(...whereClauses).fetch();

            if (existingCustomer.length > 0) {
                return { customer: existingCustomer[0], isNew: false };
            }
        }

        if (searchEmail) {
            const whereClauses: any[] = [Q.where('email', searchEmail), Q.where('deleted', false)];
            if (data.storeId) whereClauses.unshift(Q.where('store_id', data.storeId));
            else whereClauses.unshift(Q.where('business_id', data.businessId));

            const existingCustomer = await customersCollection.query(...whereClauses).fetch();

            if (existingCustomer.length > 0) {
                return { customer: existingCustomer[0], isNew: false };
            }
        }

        const newCustomer = await this.createCustomer({
            businessId: data.businessId,
            storeId: data.storeId,
            name: data.name || 'Walk-in Customer',
            phone: searchPhone,
            email: searchEmail,
            creditLimit: data.creditLimit,
        });

        return { customer: newCustomer, isNew: true };
    },

    async createCustomer(data: {
        businessId: string;
        storeId?: string;
        name: string;
        phone?: string;
        email?: string;
        creditLimit?: number;
    }) {
        return await database.write(async () => {
            return await customersCollection.create((customer) => {
                customer.externalId = `cust_${data.name}_${Date.now()}`;
                customer.businessId = data.businessId;
                if (data.storeId) customer.storeId = data.storeId;
                customer.name = capitalizeName(data.name);
                customer.phone = data.phone || '';
                customer.email = data.email || '';
                customer.creditLimit = data.creditLimit || 0;
                customer.currentBalance = 0;
                customer.reputationScore = 100;
                customer.deleted = false;
            });
        });
    },

    async updateCustomer(
        customerId: string,
        updates: Partial<{
            name: string;
            phone: string;
            email: string;
            creditLimit: number;
            reputationScore: number;
        }>,
    ) {
        const customer = await customersCollection.find(customerId);

        return await database.write(async () => {
            return await customer.update((c) => {
                if (updates.name !== undefined) c.name = capitalizeName(updates.name);
                if (updates.phone !== undefined) c.phone = updates.phone;
                if (updates.email !== undefined) c.email = updates.email;
                if (updates.creditLimit !== undefined) c.creditLimit = updates.creditLimit;
                if (updates.reputationScore !== undefined)
                    c.reputationScore = updates.reputationScore;
            });
        });
    },

    async recordPayment(customerId: string, amount: number) {
        const customer = await customersCollection.find(customerId);

        return await database.write(async () => {
            return await customer.update((c) => {
                c.currentBalance = Math.max(0, (c.currentBalance || 0) - amount);
            });
        });
    },

    async deleteCustomer(customerId: string) {
        const customer = await customersCollection.find(customerId);

        return await database.write(async () => {
            return await customer.update((c) => {
                c.deleted = true;
            });
        });
    },

    async getCustomerById(customerId: string) {
        return await customersCollection.find(customerId);
    },

    async getCustomersByBusiness(businessId: string) {
        return await customersCollection
            .query(
                Q.where('business_id', businessId),
                Q.where('deleted', false),
                Q.sortBy('name', Q.asc),
            )
            .fetch();
    },

    async getCustomersByStore(storeId: string) {
        return await customersCollection
            .query(Q.where('store_id', storeId), Q.where('deleted', false), Q.sortBy('name', Q.asc))
            .fetch();
    },

    async searchCustomers(businessId: string, searchTerm: string, storeId?: string) {
        const like = `%${Q.sanitizeLikeString(searchTerm)}%`;
        const whereClause = storeId
            ? Q.where('store_id', storeId)
            : Q.where('business_id', businessId);
        return await customersCollection
            .query(
                whereClause,
                Q.where('deleted', false),
                Q.or(Q.where('name', Q.like(like)), Q.where('phone', Q.like(like))),
                Q.sortBy('name', Q.asc),
            )
            .fetch();
    },

    async getCustomersWithCredit(businessId: string, storeId?: string) {
        const whereClause = storeId
            ? Q.where('store_id', storeId)
            : Q.where('business_id', businessId);

        const customers = await customersCollection
            .query(whereClause, Q.where('deleted', false))
            .fetch();

        return customers.filter((c) => (c.currentBalance || 0) > 0);
    },

    // Returns a live observable of customers for a business. Caller should subscribe()
    // and filter for customers with credit if desired.
    observeCustomersWithCredit(businessId: string, storeId?: string) {
        const whereClause = storeId
            ? Q.where('store_id', storeId)
            : Q.where('business_id', businessId);

        const query = customersCollection.query(
            whereClause,
            Q.where('deleted', false),
            Q.sortBy('name', Q.asc),
        );

        return query.observe();
    },

    /**
     * Returns an observable that emits the total outstanding credit (sum of currentBalance)
     * for a business, optionally scoped to a store. This is useful for reactive UI that
     * wants to display the total credit without having to reduce the full customer list.
     */
    observeTotalCredit(businessId: string, storeId?: string) {
        const whereClause = storeId
            ? Q.where('store_id', storeId)
            : Q.where('business_id', businessId);

        const query = customersCollection.query(whereClause, Q.where('deleted', false));

        // Use the query observable and map to the numeric sum
        return query.observe().pipe(
            map((results: any[]) => results.reduce((sum, c) => sum + (c.currentBalance || 0), 0)),
            shareReplay(1),
        );
    },

    async getCustomerWithSales(customerId: string) {
        const customer = await customersCollection.find(customerId);
        const sales = await customer.sales.fetch();
        return { customer, sales };
    },
};
