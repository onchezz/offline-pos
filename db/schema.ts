import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'sessions',
            columns: [
                { name: 'session_id', type: 'string', isIndexed: true }, // text UNIQUE
                { name: 'user_id', type: 'string', isIndexed: true }, // foreign key to users(id)
                { name: 'created_at', type: 'number' }, // session creation timestamp
                { name: 'updated_at', type: 'number' }, // last updated timestamp
                { name: 'is_active', type: 'boolean' }, // whether session is active
            ],
        }),
        tableSchema({
            name: 'users',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'email', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'name', type: 'string', isOptional: true },
                { name: 'phone', type: 'string', isOptional: true },
                { name: 'password_hash', type: 'string', isOptional: true },
                { name: 'pin_hash', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' }, // store as timestamp (ms)
                { name: 'updated_at', type: 'number' }, // store as timestamp (ms)
                { name: 'deleted', type: 'boolean', isOptional: true },
                { name: 'is_owner', type: 'boolean', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'businesses',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'name', type: 'string' }, // NOT NULL
                { name: 'business_type', type: 'string', isOptional: true },
                { name: 'owner_id', type: 'string', isIndexed: true }, // foreign key to app_users(id)
                { name: 'created_at', type: 'number' }, // store as timestamp (ms)
                { name: 'updated_at', type: 'number' }, // store as timestamp (ms)
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'stores',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'business_id', type: 'string', isIndexed: true }, // foreign key to businesses(id)
                { name: 'name', type: 'string' }, // NOT NULL
                { name: 'type', type: 'string', isOptional: true }, // store type (e.g., 'retail', 'wholesale')
                { name: 'address', type: 'string', isOptional: true },
                { name: 'phone', type: 'string', isOptional: true },
                { name: 'email', type: 'string', isOptional: true },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'weekday_hours', type: 'string', isOptional: true },
                { name: 'weekend_hours', type: 'string', isOptional: true },
                { name: 'tax_id', type: 'string', isOptional: true },
                { name: 'established_year', type: 'string', isOptional: true },
                { name: 'manager_id', type: 'string', isOptional: true, isIndexed: true }, // foreign key to app_users(id)
                { name: 'status', type: 'string', isOptional: true }, // default 'active' (handle in app logic)
                { name: 'currency', type: 'string', isOptional: true }, // default 'KES'
                { name: 'timezone', type: 'string', isOptional: true },
                { name: 'logo_url', type: 'string', isOptional: true },
                { name: 'wholesale_enabled', type: 'boolean', isOptional: true },
                { name: 'receipt_footer', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' }, // timestamp (ms)
                { name: 'updated_at', type: 'number' }, // timestamp (ms)
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),

        // Roles table
        tableSchema({
            name: 'roles',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'business_id', type: 'string', isIndexed: true }, // FK -> businesses(id)
                { name: 'store_id', type: 'string', isIndexed: true }, // FK -> stores(id)
                { name: 'name', type: 'string' }, // NOT NULL
                { name: 'permissions', type: 'string', isOptional: true }, // store JSON as string
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),

        // Staff table
        tableSchema({
            name: 'staff',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'user_id', type: 'string', isIndexed: true }, // FK -> app_users(id)
                { name: 'store_id', type: 'string', isIndexed: true }, // FK -> stores(id)
                { name: 'role_id', type: 'string', isIndexed: true }, // FK -> roles(id)
                { name: 'assigned_at', type: 'number', isOptional: true }, // timestamp (ms)
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),

        // Categories table
        tableSchema({
            name: 'categories',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'business_id', type: 'string', isIndexed: true }, // FK -> businesses(id)
                { name: 'store_id', type: 'string', isIndexed: true },
                { name: 'name', type: 'string' }, // NOT NULL
                { name: 'icon', type: 'string', isOptional: true },
                { name: 'color', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' }, // timestamp (ms)
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),

        // Products table
        tableSchema({
            name: 'products',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'store_id', type: 'string', isIndexed: true }, // FK -> businesses(id)
                { name: 'category_id', type: 'string', isIndexed: true }, // FK -> categories(id)
                { name: 'name', type: 'string' }, // NOT NULL
                { name: 'brand', type: 'string', isOptional: true },
                { name: 'barcode', type: 'string', isOptional: true, isIndexed: true },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'unit', type: 'string', isOptional: true },
                { name: 'quantity_per_unit', type: 'string', isOptional: true },
                { name: 'status', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),

        // Inventory table
        tableSchema({
            name: 'inventory',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'product_id', type: 'string', isIndexed: true }, // FK -> products(id)
                { name: 'store_id', type: 'string', isIndexed: true }, // FK -> stores(id)
                { name: 'quantity', type: 'number', isOptional: true },
                { name: 'min_stock', type: 'number', isOptional: true },
                { name: 'max_stock', type: 'number', isOptional: true },
                { name: 'price', type: 'number', isOptional: true },
                { name: 'whole_sale_price', type: 'number', isOptional: true },
                { name: 'weighted_avg_cost', type: 'number', isOptional: true },
                { name: 'last_purchase_price', type: 'number', isOptional: true },
                { name: 'location', type: 'string', isOptional: true },
                { name: 'last_updated', type: 'number', isOptional: true },
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),

        // Customers table
        tableSchema({
            name: 'customers',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'business_id', type: 'string', isIndexed: true }, // FK -> businesses(id)
                { name: 'store_id', type: 'string', isIndexed: true, isOptional: true }, // FK -> stores(id)
                { name: 'name', type: 'string' }, // NOT NULL
                { name: 'phone', type: 'string', isOptional: true, isIndexed: true },
                { name: 'email', type: 'string', isOptional: true },
                { name: 'credit_limit', type: 'number', isOptional: true },
                { name: 'current_balance', type: 'number', isOptional: true },
                { name: 'reputation_score', type: 'number', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'deleted', type: 'boolean', isOptional: true },
            ],
        }),

        // Sales table
        tableSchema({
            name: 'sales',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'store_id', type: 'string', isIndexed: true }, // FK -> stores(id)
                { name: 'user_id', type: 'string', isIndexed: true }, // FK -> app_users(id)
                { name: 'customer_id', type: 'string', isOptional: true, isIndexed: true }, // FK -> customers(id)
                { name: 'total_amount', type: 'number' },
                { name: 'discount_amount', type: 'number', isOptional: true },
                { name: 'discount_percentage', type: 'number', isOptional: true },
                { name: 'subtotal', type: 'number' },
                { name: 'payment_method', type: 'string', isOptional: true },
                { name: 'payment_methods_used', type: 'string', isOptional: true }, // JSON array of methods: ["mpesa", "cash"]
                { name: 'mpesa_amount', type: 'number', isOptional: true }, // Amount paid via M-Pesa
                { name: 'cash_amount', type: 'number', isOptional: true }, // Amount paid via Cash
                { name: 'on_credit', type: 'boolean', isOptional: true },
                { name: 'amount_paid', type: 'number', isOptional: true }, // Amount paid immediately
                { name: 'amount_on_credit', type: 'number', isOptional: true }, // Amount on credit (partial payment)
                { name: 'due_date', type: 'number', isOptional: true }, // due date timestamp (ms)
                { name: 'is_wholesale', type: 'boolean', isOptional: true },
                { name: 'status', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Sales items table
        tableSchema({
            name: 'sales_items',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true }, // text UNIQUE
                { name: 'sale_id', type: 'string', isIndexed: true }, // FK -> sales(id)
                { name: 'product_id', type: 'string', isIndexed: true }, // FK -> products(id)
                { name: 'quantity', type: 'number' },
                { name: 'unit_price', type: 'number' },
                { name: 'total_price', type: 'number' },
                { name: 'discount', type: 'number', isOptional: true },
            ],
        }),

        // Payments table - store individual payments pinned to a sale
        tableSchema({
            name: 'payments',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'sale_id', type: 'string', isIndexed: true }, // FK -> sales(id)
                { name: 'amount', type: 'number' },
                { name: 'method', type: 'string', isOptional: true },
                { name: 'note', type: 'string', isOptional: true },
                { name: 'status', type: 'string', isOptional: true }, // e.g., 'completed', 'pending'
                { name: 'payment_date', type: 'number', isOptional: true }, // timestamp (ms)
                { name: 'details', type: 'string', isOptional: true }, // JSON string with payment-specific metadata (e.g., mpesa number, card last4)
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Inventory batches table - tracks all inventory movements
        tableSchema({
            name: 'inventory_batches',
            columns: [
                { name: 'external_id', type: 'string', isOptional: true, isIndexed: true },
                { name: 'inventory_id', type: 'string', isIndexed: true }, // FK -> inventory(id)
                { name: 'product_id', type: 'string', isIndexed: true }, // FK -> products(id)
                { name: 'store_id', type: 'string', isIndexed: true }, // FK -> stores(id)
                { name: 'user_id', type: 'string', isIndexed: true }, // FK -> users(id) - who made the change
                { name: 'quantity_change', type: 'number' }, // positive for additions, negative for deductions
                { name: 'quantity_before', type: 'number' }, // quantity before change
                { name: 'quantity_after', type: 'number' }, // quantity after change
                { name: 'cost_per_unit', type: 'number', isOptional: true }, // cost at time of batch
                { name: 'batch_type', type: 'string' }, // 'purchase', 'sale', 'adjustment', 'return', 'damage'
                { name: 'reference_id', type: 'string', isOptional: true, isIndexed: true }, // sale_id or purchase_id
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),
        // Printer preference store - keeps a single saved BLE printer (preferred)
        tableSchema({
            name: 'printer_preferences',
            columns: [
                { name: 'device_id', type: 'string' },
                { name: 'name', type: 'string', isOptional: true },
                { name: 'service_uuid', type: 'string', isOptional: true },
                { name: 'characteristic_uuid', type: 'string', isOptional: true },
                { name: 'saved_at', type: 'number' },
                { name: 'auto_print', type: 'boolean', isOptional: true },
                { name: 'auto_connect', type: 'boolean', isOptional: true },
            ],
        }),
    ],
});
