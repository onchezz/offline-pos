import { Database } from '@nozbe/watermelondb';
import LokiJSAdapter from '@nozbe/watermelondb/adapters/lokijs';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { Platform } from 'react-native';

// import migrations from './migrations';
import Business from './models/business';
import Category from './models/categories';
import Customer from './models/customers';
import Inventory from './models/inventory';
import Payment from './models/payments';
import PrinterPreference from './models/printer_preference';
import Product from './models/products';
import Role from './models/roles';
import Sale from './models/sales';
import SaleItem from './models/sales_items';
import Session from './models/sessions';
import Staff from './models/staff';
import Store from './models/stores';
import User from './models/users';
import schema from './schema';

// Select adapter based on platform
// const isWeb = typeof document !== 'undefined' || Platform.OS === 'web' || !Platform.OS; // fallback for pure web environments

const adapter =   new LokiJSAdapter({
          schema,
          useWebWorker: false,
          useIncrementalIndexedDB: true,
          dbName: 'pos',
          onSetUpError: (error) => {
              console.error('LokiJS setup failed', error);
          },
      });
    // : new SQLiteAdapter({
    //       schema,
    //       //    migrations,
    //       jsi: true,
    //       onSetUpError: (error) => {
    //           console.error('SQLite setup failed', error);
    //       },
    //   });

// Then, make a Watermelon database from it
export const database = new Database({
    adapter,

    modelClasses: [
        User,
        Session,
        Business,
        Store,
        PrinterPreference,
        Role,
        Staff,
        Category,
        Product,
        Inventory,
        Customer,
        Sale,
        SaleItem,
        Payment,
    ],
    // actionsEnabled: true,
});

export const storeCollection = database.collections.get<Store>('stores');
export const userCollection = database.collections.get<User>('users');
export const sessionCollection = database.collections.get<Session>('sessions');
export const categoriesCollection = database.collections.get<Category>('categories');
export const salesCollection = database.collections.get<Sale>('sales');
export const saleItemsCollection = database.collections.get<SaleItem>('sales_items');
export const customersCollection = database.collections.get<Customer>('customers');
export const paymentsCollection = database.collections.get<Payment>('payments');
export const productsCollection = database.collections.get<Product>('products');
export const inventoryCollection = database.collections.get<Inventory>('inventory');
// export const inventoryBatchesCollection =
//     database.collections.get<InventoryBatch>('inventory_batches');
export const staffCollection = database.collections.get<Staff>('staff');
export const businessCollection = database.collections.get<Business>('businesses');
export const roleCollection = database.collections.get<Role>('roles');
export const printerPreferencesCollection =
    database.collections.get<PrinterPreference>('printer_preferences');
