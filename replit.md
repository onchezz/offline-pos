# POS (Point of Sale) - Expo React Native App

## Overview
This is an Expo-based Point of Sale (POS) application built with React Native, supporting web, iOS, and Android platforms. Its core purpose is to provide a comprehensive POS solution with robust inventory management, efficient checkout processes, credit transaction handling, and account management capabilities. The application aims to streamline retail operations, offering features like real-time inventory tracking, sales processing, and customer credit management across multiple platforms.

## User Preferences
I prefer iterative development, with clear communication at each major step. Please ask before making significant architectural changes or adding new external dependencies. I value detailed explanations for complex implementations. Ensure that the coding style is consistent with modern React Native best practices, favoring functional components and hooks. Do not introduce any breaking changes without prior discussion.

## System Architecture
The application is built with Expo SDK 54, React 19.1.0, and React Native 0.81.4. It uses WatermelonDB for local data persistence, with LokiJS (IndexedDB) for web and SQLite for native platforms. Styling is managed with NativeWind (Tailwind CSS for React Native), and navigation is handled by Expo Router v6. The project uses TypeScript 5.9 for type safety.

**Key Technical Implementations & Design Decisions:**
- **Cross-Platform Database Handling**: WatermelonDB is configured with platform-specific adapters (`db/index.web.ts` for LokiJS and `db/index.native.ts` for SQLite) to ensure compatibility and performance across web and native environments.
- **Babel and TypeScript Configuration**: Specific Babel plugins (`@babel/plugin-proposal-class-properties`, `@babel/plugin-proposal-decorators`) and TypeScript settings (`useDefineForClassFields: false`) are in place to support WatermelonDB's decorator-based model definitions.
- **Modular Project Structure**: The application is organized into logical directories: `app/` for Expo Router pages, `components/` for reusable UI, `contexts/` for global state, `db/` for database logic, `hooks/` for custom React hooks, and `utils/` for utility functions.
- **Data Flow & State Management**: React Contexts (`AuthContext`, `BusinessContext`, `CartContext`) are used for global state management. `CartContext` ensures persistent cart state across the checkout flow.
- **Real-time Data Observation**: Custom hooks like `useInventoryData` and `useCheckoutProducts` leverage WatermelonDB's observable queries for real-time updates of inventory and product data.
- **UI/UX**: The application supports dark mode. Modals are extensively used for product addition and editing to provide a seamless user experience.
- **Inventory Management**: Features include adding, editing, and deleting products and categories, real-time inventory filtering, low stock alerts, and manual inventory adjustments with detailed batch tracking (purchase, return, damage, etc.).
- **Checkout Flow**: Supports category-based product selection, a persistent shopping cart, various payment methods (cash, card, mobile, credit), discount application, and automatic inventory deduction upon sale completion.
- **Credit Sales**: Integrated credit sales management updates customer balances automatically.
- **Database Services**: A dedicated `db/services` layer encapsulates CRUD operations and business logic for `productService`, `categoryService`, `inventoryService`, `salesService`, and `customerService`.
- **Database Schema**: The schema includes `User`, `Session`, `Business`, `Store`, `Role`, `Staff`, `Category`, `Product`, `Inventory`, `InventoryBatch`, `Customer`, `Sale`, and `SaleItem` models.
- **Payment System**: Includes intelligent partial payment auto-fill, tracking of multiple payment methods per transaction, and accurate credit balance management.

## External Dependencies
- **Expo SDK**: Core framework for React Native development.
- **WatermelonDB**: Local database for data persistence.
  - **LokiJS**: WatermelonDB adapter for web (uses IndexedDB).
  - **SQLite**: WatermelonDB adapter for native platforms.
- **NativeWind**: Utility-first CSS framework for React Native (integrates Tailwind CSS).
- **Expo Router**: File-system based router for Expo and React Native.
- **Node.js**: Runtime environment (version 22).
- **TypeScript**: Language superset for JavaScript (version 5.9).

## Recent Updates

### October 17, 2025 - Credit & Transaction UI Enhancements
- **Intelligent Partial Payment Auto-Fill System**
  - **Smart Auto-Fill Logic**:
    - First selection: Auto-fills with total amount when no payments entered yet
    - Subsequent selections: Auto-fills with `Math.max(0, remaining)` to prevent overpayment
    - When total already covered: Auto-fills with $0.00 instead of full total
    - Manual editing: Once user types in a field, auto-fill is disabled for that field
    - Tracks edit state: `hasManuallyEditedMpesa`, `hasManuallyEditedCash`, `hasManuallyEditedCredit`
  
  - **User Experience**:
    - Users can freely type amounts without auto-override
    - Switching payment methods preserves manually entered amounts
    - Auto-fill only applies to empty, unedited fields
    - Remaining balance automatically flows to next payment method when appropriate
    - Prevents overpayment when one method already covers the total
  
  - **State Management**:
    - All payment state (amounts, edit flags, customer selection) resets after successful payment
    - Ensures clean slate for next transaction
  
  - **Payment Methods Tracking**:
    - Added `payment_methods_used` field to sales table (JSON array of methods used)
    - Added `mpesa_amount` and `cash_amount` fields to track individual payment amounts
    - System saves all payment methods used in a transaction (e.g., ["mpesa", "cash", "store-credit"])
  
  - **Credit Balance Management**:
    - Credit amount is automatically added to customer's current balance when sale completes
    - Partial payments properly track amount paid vs amount on credit
    - Customer balance updates happen in completeSale transaction
  
  - **Schema Update**:
    - Database schema version updated to 3
    - Added new fields: payment_methods_used, mpesa_amount, cash_amount
    - Added state tracking: hasManuallyEditedMpesa, hasManuallyEditedCash, hasManuallyEditedCredit

- **Credit & Transactions UI Overhaul**
  - **Credit Tab Improvements**:
    - Record Payment form at top with customer search and amount input
    - Interactive search functionality with TextInput
    - Credit rating badges (Good/Medium/Low) based on balance thresholds (>$100=Low, >$50=Medium, ≤$50=Good)
    - Customer list shows outstanding balances with navigation to detail page
    - Due date display (Note: Currently placeholder due to database schema limitations - no due_date field in Customer model)
  
  - **Customer Detail Page**:
    - Real-time data from WatermelonDB (customer, transactions)
    - Credit overview card showing current balance, total credits, total payments
    - Transaction history listing customer's credit purchases
    - Delete customer functionality with soft delete
    - Proper navigation between credit list and transaction details
  
  - **Transactions Tab Enhancements**:
    - Today's Sales Summary card (total sales, transaction count, estimated profit)
    - Category icons displayed from product's first category
    - Time-only display (HH:MM format) instead of full datetime
    - Customer names shown for credit transactions
    - Payment method color-coded badges (Cash/Credit/M-Pesa/Card)
    - Enhanced data fetching for customer and category metadata per transaction
  
  - **Transaction Detail Page**:
    - Credit sale info box (orange highlight) when amountOnCredit > 0
    - Shows customer name and credit message
    - Simplified items display with product names in styled boxes
    - Complete payment method breakdown with individual amounts
    - Category icon and transaction metadata
  
  - **Reusable Components**:
    - CreditRatingBadge component with color-coded ratings
    - RecordPaymentForm for consistent payment recording UI
    - Enhanced transaction list with Map-based item metadata storage

- **Enhanced Transaction Management**
  - **Cart Management**:
    - Cart automatically clears after successful payment completion
    - Ensures clean state for next transaction
  
  - **Customer Management During Checkout**:
    - Support for creating new customers during credit checkout
    - Support for linking transactions to existing customers
    - CustomerSearchSelector allows searching by name or phone
    - Seamless flow for both new and returning customers
  
  - **Transaction Detail View**:
    - Comprehensive payment method breakdown with color-coded indicators
    - Shows individual amounts for M-Pesa, Cash, and Store Credit
    - Safe JSON parsing with graceful fallback to legacy display
    - Displays all transaction details: items, customer, cashier, store, payment methods
    - Product-level detail showing quantity and prices for each item
  
  - **Transaction List Enhancements**:
    - Shows product preview (first 2 items + count) for each transaction
    - Preserves WatermelonDB model integrity for navigation
    - Map-based architecture for efficient item metadata lookup
    - Item count and preview displayed with cube icon
  
  - **Data Integrity**:
    - Sale items properly linked to products via SaleItem model
    - Customer balance automatically updates when credit is used
    - Transaction-to-product relationship maintained throughout system
    - All payment methods and amounts tracked in database