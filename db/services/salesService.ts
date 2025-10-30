import { Q } from '@nozbe/watermelondb';
import {
    customersCollection,
    database,
    inventoryCollection,
    paymentsCollection,
    productsCollection,
    saleItemsCollection,
    salesCollection,
} from '..';
import Customer from '../models/customers';
// inventoryService imported in past but we update inventory directly inside writers to avoid nested writer conflicts
// import { inventoryService } from './inventoryService';

export const salesService = {
    async createSale(
        saleData: {
            storeId: string;
            userId: string;
            customerId?: string;
            subtotal: number;
            discountAmount?: number;
            discountPercentage?: number;
            totalAmount: number;
            paymentMethod: string;
            onCredit: boolean;
            amountOnCredit?: number;
            amountPaid?: number;
            paymentMethodsUsed?: string;
            mpesaAmount?: number;
            cashAmount?: number;
            dueDate?: number;
        },
        items: {
            productId: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            discount?: number;
        }[],
    ) {
        console.log(
            'oncredit ',
            saleData.onCredit,
            'amount ',
            saleData.amountOnCredit,
            'cash ',
            saleData.cashAmount,
            'mpesa ',
            saleData.mpesaAmount,
        );
        return await database.write(async () => {
            const sale = await salesCollection.create((s) => {
                s.externalId = `TXN${Date.now()}`;
                s.storeId = saleData.storeId;
                s.userId = saleData.userId;
                s.customerId = saleData.customerId || '';
                s.subtotal = saleData.subtotal;
                s.discountAmount = saleData.discountAmount || 0;
                s.discountPercentage = saleData.discountPercentage || 0;
                s.totalAmount = saleData.totalAmount;
                s.paymentMethod = saleData.paymentMethod;
                s.isWholesale = !!(saleData as any).isWholesale;
                if (saleData.amountOnCredit! > 0) s.onCredit = true || saleData.onCredit;
                if (saleData.dueDate) s.dueDate = saleData.dueDate;
                // persist amounts/payments so we can inspect later
                s.amountOnCredit = saleData.amountOnCredit || 0;
                s.amountPaid = saleData.amountPaid || 0;
                s.paymentMethodsUsed = saleData.paymentMethodsUsed || '';
                s.mpesaAmount = saleData.mpesaAmount || 0;
                s.cashAmount = saleData.cashAmount || 0;
                s.status = 'pending';
            });

            const allSaleItems = items.map((item) =>
                saleItemsCollection.create((saleItem) => {
                    saleItem.externalId = `item_${Date.now()}_${Math.random()}`;
                    saleItem.saleId = sale.id;
                    saleItem.productId = item.productId;
                    saleItem.quantity = item.quantity;
                    saleItem.unitPrice = item.unitPrice;
                    saleItem.totalPrice = item.totalPrice;
                    if (item.discount) saleItem.discount = item.discount;
                }),
            );
            // Ensure any async creation completions are awaited. collection.create is
            // synchronous inside a write, but await Promise.resolve to be safe.
            await Promise.all(allSaleItems.map((it) => Promise.resolve(it)));

            // Create Payment records for any initial payments (cash/mpesa/amountPaid)
            // Normalize so that payments are always stored as Payment records.
            const initialPayments: { amount: number; method?: string; note?: string }[] = [];

            // Prefer explicit breakdowns if provided
            if (saleData.mpesaAmount && saleData.mpesaAmount > 0) {
                initialPayments.push({ amount: saleData.mpesaAmount, method: 'mpesa' });
            }
            if (saleData.cashAmount && saleData.cashAmount > 0) {
                initialPayments.push({ amount: saleData.cashAmount, method: 'cash' });
            }

            // If amountPaid is provided but no breakdown, create a generic payment using paymentMethod

            // Create payment records inside the same write transaction and update sale.amountPaid
            if (initialPayments.length > 0 || saleData.onCredit) {
                for (const p of initialPayments) {
                    await paymentsCollection.create((pay) => {
                        pay.externalId = `PAY${(p.method || '').toUpperCase()}${Date.now()}`;
                        pay.saleId = sale.id;
                        pay.amount = p.amount;
                        pay.method = p.method || '';
                        pay.note = `$${p.amount} via ${p.method!}`;
                        pay.status = 'completed';
                        // pay.paymentDate = Date.now();
                    });
                }

                // Recalculate and persist sale.amountPaid, amountOnCredit and status
                // const totalInitialPaid = initialPayments.reduce((s, p) => s + p.amount, 0);
                await sale.update((s) => {
                    if (s.onCredit) {
                        // If there's still outstanding amount, mark awaiting completion,
                        // otherwise this was a fully-paid credit sale.
                        if (s.amountOnCredit > 0) {
                            s.status = 'Awaiting Completion';
                        } else {
                            s.status = 'Fullpayment received';
                        }
                    } else {
                        s.status = 'completed';
                    }
                });

                // If this sale is on credit and has a customer, add the outstanding amount to the customer's balance
                // so customers with partial payments appear in credit lists.
                try {
                    const saleAfter = await salesCollection.find(sale.id);
                    const outstanding = saleAfter.amountOnCredit || 0;
                    if (saleAfter.onCredit && saleAfter.customerId && outstanding > 0) {
                        const customer = await customersCollection.find(saleAfter.customerId);
                        await customer.update((c: Customer) => {
                            c.currentBalance = (c.currentBalance || 0) + outstanding;
                        });
                    }
                } catch (err) {
                    console.warn('Failed to record customer credit after sale creation', err);
                }
            }

            return sale;
        });
    },

    async completeSale(saleId: string) {
        const sale = await salesCollection.find(saleId);
        const saleItems = await sale.items.fetch();

        return await database.write(async () => {
            // Adjust inventory by directly updating the inventory record inside this writer
            for (const item of saleItems) {
                const inventories = await inventoryCollection
                    .query(
                        Q.where('product_id', item.productId),
                        Q.where('store_id', sale.storeId),
                        Q.where('deleted', false),
                    )
                    .fetch();

                const inventory = inventories.length > 0 ? inventories[0] : null;

                if (inventory) {
                    // Use update() directly to avoid nested writer calls
                    await inventory.update((inv) => {
                        inv.quantity = (inv.quantity || 0) - item.quantity;
                    });
                }
            }

            if (sale.onCredit && sale.customerId) {
                // If sale was already recorded with an outstanding amount at creation, avoid adding it again.
                // We assume createSale added outstanding to customer.currentBalance when partial payment happened.
                // Here we set the final status depending on whether there's still outstanding balance.

                if (sale.onCredit && sale.mpesaAmount! <= 0 && sale.cashAmount! <= 0) {
                    await sale.update((s) => {
                        s.status = 'Credit';
                    });
                } else if ((sale.amountOnCredit || 0) > 0) {
                    await sale.update((s) => {
                        s.status = 'Partially Paid';
                    });
                } else {
                    await sale.update((s) => {
                        s.status = 'completed';
                    });
                }
            } else {
                await sale.update((s) => {
                    s.status = sale.onCredit ? 'Fullpayment received' : 'completed';
                });
            }

            return sale;
        });
    },

    async createPayment(paymentData: {
        saleId: string;
        amount: number;
        method?: string;
        note?: string;
        paymentDate?: number;
        // arbitrary metadata describing payment specifics (mpesa number, card last4, provider response, etc.)
        details?: Record<string, any> | string;
    }) {
        return await database.write(async () => {
            const payment = await paymentsCollection.create((p) => {
                p.externalId = `PAY${paymentData.method || ''}${Date.now()}`;
                p.saleId = paymentData.saleId;
                p.amount = paymentData.amount;
                p.method = paymentData.method || '';
                p.note = paymentData.note || '';
                p.status = 'completed';

                // persist a canonical payment date timestamp

                // store details as JSON string when provided
                if (paymentData.details) {
                    p.details =
                        typeof paymentData.details === 'string'
                            ? paymentData.details
                            : JSON.stringify(paymentData.details);
                }
            });

            // Update sale.amountPaid and status
            try {
                const sale = await salesCollection.find(paymentData.saleId);
                await sale.update((s) => {
                    s.amountPaid = (s.amountPaid || 0) + paymentData.amount;
                    const remaining = (s.totalAmount || 0) - (s.amountPaid || 0);
                    // If this sale was a credit sale, mark a distinct status when fully paid
                    if (remaining <= 0) {
                        s.status = sale.onCredit ? 'Fullpayment received' : 'completed';
                    }
                });

                // If sale is on credit and has a customer, update customer's balance
                if (sale.onCredit && sale.customerId) {
                    const customer = await customersCollection.find(sale.customerId);
                    await customer.update((c: Customer) => {
                        c.currentBalance = Math.max(
                            0,
                            (c.currentBalance || 0) - paymentData.amount,
                        );
                    });
                }
            } catch (e) {
                console.error('Failed to update sale or customer after payment:', e);
            }

            return payment;
        });
    },

    async getPaymentsForSale(saleId: string) {
        return await paymentsCollection
            .query(Q.where('sale_id', saleId), Q.sortBy('payment_date', Q.asc))
            .fetch();
    },

    async getSaleById(saleId: string) {
        return await salesCollection.find(saleId);
    },

    async getSalesByStore(storeId: string, limit: number = 100) {
        return await salesCollection
            .query(Q.where('store_id', storeId), Q.sortBy('created_at', Q.desc), Q.take(limit))
            .fetch();
    },

    async getSalesByDateRange(storeId: string, startDate: Date, endDate: Date) {
        return await salesCollection
            .query(
                Q.where('store_id', storeId),
                Q.where('created_at', Q.between(startDate.getTime(), endDate.getTime())),
                Q.sortBy('created_at', Q.desc),
            )
            .fetch();
    },

    async getSalesByCustomer(customerId: string) {
        return await salesCollection
            .query(Q.where('customer_id', customerId), Q.sortBy('created_at', Q.desc))
            .fetch();
    },

    async getCreditSales(storeId: string) {
        return await salesCollection
            .query(
                Q.where('store_id', storeId),
                Q.where('on_credit', true),
                Q.sortBy('created_at', Q.desc),
            )
            .fetch();
    },

    async getSaleWithItems(saleId: string) {
        const sale = await salesCollection.find(saleId);
        const items = await sale.items.fetch();

        const itemsWithProducts = await Promise.all(
            items.map(async (item) => {
                // Primary lookup: assume item.productId is a product id
                try {
                    const product = await productsCollection.find(item.productId);
                    return { item, product };
                } catch {
                    // Fallback: item.productId might actually be an inventory id (legacy/other flows)
                    try {
                        const inventory = await inventoryCollection.find(item.productId);
                        const product = await inventory.product.fetch();
                        return { item, product };
                    } catch {
                        console.warn(
                            `Failed to resolve product for sale item ${item.id} (productId/inventoryId=${item.productId})`,
                        );
                        // Return a minimal placeholder product so callers don't crash; UI will show 'Unknown Product'
                        const placeholder = {
                            id: item.productId,
                            name: 'Unknown Product',
                            barcode: '',
                            category: '',
                            unit: '',
                            price: 0,
                        } as any;
                        return { item, product: placeholder };
                    }
                }
            }),
        );

        return { sale, items: itemsWithProducts };
    },

    async getTodaySales(storeId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        return await this.getSalesByDateRange(storeId, today, tomorrow);
    },

    async getSalesStats(storeId: string, startDate: Date, endDate: Date) {
        const sales = await this.getSalesByDateRange(storeId, startDate, endDate);

        const stats = sales.reduce(
            (acc, sale) => {
                acc.totalSales += 1;
                acc.totalRevenue += sale.totalAmount;
                acc.totalDiscount += sale.discountAmount || 0;
                if (sale.onCredit) {
                    acc.creditSales += 1;
                    acc.creditAmount += sale.totalAmount;
                }
                if (sale.status === 'completed') {
                    acc.completedSales += 1;
                }
                return acc;
            },
            {
                totalSales: 0,
                completedSales: 0,
                totalRevenue: 0,
                totalDiscount: 0,
                creditSales: 0,
                creditAmount: 0,
            },
        );

        return stats;
    },
};
