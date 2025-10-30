import { CreditSummarySection } from '@/components/credit/CreditSummarySection';
import { CreditTopTabs } from '@/components/credit/CreditTopTabs';
import { CustomerCreditItem } from '@/components/credit/CustomerCreditItem';

import { RecordPaymentForm } from '@/components/credit/forms/RecordPaymentForm';
import Customer from '@/db/models/customers';
import { salesService } from '@/db/services/salesService';
import { useCreditData } from '@/hooks/useCreditData';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreditScreen: React.FC = () => {
    const [showCreditRating, setShowCreditRating] = useState(true);
    const [customerSearchQuery, setCustomerSearchQuery] = useState('');
    const [amountPaid, setAmountPaid] = useState('');

    const {
        customers,
        isLoading,
        searchQuery,
        setSearchQuery,
        totalCreditAmount,
        selectedCustomer,
        setSelectedCustomer,
        handleRecordPayment,
    } = useCreditData();

    // We observe customers via `useCreditData` live subscription and prefer the
    // live customer object for display so the UI reflects DB updates immediately.

    // store the raw due timestamp (ms since epoch) or null
    const [saleDueMap, setSaleDueMap] = useState<Record<string, number | null>>({});

    // Local helper to compute days until due (positive = days left, negative = overdue)
    const computeDaysDue = (dueTimestamp?: number | null) => {
        if (!dueTimestamp) return null;
        const today = new Date();
        const due = new Date(dueTimestamp);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    // Populate due dates for visible customers when the customers list changes
    React.useEffect(() => {
        let mounted = true;
        (async () => {
            const updates: Record<string, number | null> = {};
            for (const c of customers) {
                try {
                    const sales = await salesService.getSalesByCustomer(c.id);
                    // pick the most recent sale that has outstanding amount
                    let targetSale: any | null = null;
                    for (const s of sales) {
                        const remaining = (s.totalAmount || 0) - (s.amountPaid || 0);
                        if (remaining > 0) {
                            targetSale = s;
                            break;
                        }
                    }
                    if (!mounted) return;
                    // store the raw due timestamp (or null) so we can compute days and a formatted string later
                    updates[c.id] = targetSale && targetSale.dueDate ? targetSale.dueDate : null;
                } catch (err) {
                    console.warn('Failed to fetch latest sale for customer', c.id, err);
                    updates[c.id] = null;
                }
            }
            if (mounted) setSaleDueMap((prev) => ({ ...prev, ...updates }));
        })();
        return () => {
            mounted = false;
        };
    }, [customers]);

    const getCreditRating = (balance: number): 'Good' | 'Medium' | 'Low' => {
        if (balance > 100) return 'Low';
        if (balance > 50) return 'Medium';
        return 'Good';
    };

    // days due calculation is provided by useCreditData.getDaysDue

    const suggestedCustomers = customers.filter((c) => {
        const name = c?.name ?? '';
        const query = customerSearchQuery ?? '';
        return name.toLowerCase().includes(query.toLowerCase());
    });

    const handleSelectCustomer = async (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerSearchQuery(customer.name);
        setAmountPaid(customer.currentBalance.toFixed(2));
        try {
            const sales = await salesService.getSalesByCustomer(customer.id);
            let targetSale: any | null = null;
            for (const s of sales) {
                const remaining = (s.totalAmount || 0) - (s.amountPaid || 0);
                if (remaining > 0) {
                    targetSale = s;
                    break;
                }
            }
            if (targetSale && targetSale.dueDate) {
                // store raw timestamp
                setSaleDueMap((prev) => ({ ...prev, [customer.id]: targetSale.dueDate }));
            } else {
                setSaleDueMap((prev) => ({ ...prev, [customer.id]: null }));
            }
        } catch (err) {
            console.warn('Failed to fetch latest sale for selected customer', customer.id, err);
            setSaleDueMap((prev) => ({ ...prev, [customer.id]: null }));
        }
    };

    const handleRecordPress = async (method?: string, details?: any) => {
        if (selectedCustomer && amountPaid) {
            await handleRecordPayment(selectedCustomer, amountPaid, method, details);
            // keep the selected customer visible until user clears or selects another
            // but clear input fields as needed
            setAmountPaid('');
        }
    };

    const handleCustomerPress = (customer: Customer) => {
        router.push({
            pathname: '/credit/credit-details',
            params: {
                customerId: customer.id,
                name: customer.name,
                phone: customer.phone,
                currentBalance: customer.currentBalance.toString(),
            },
        });
    };

    return (
        <SafeAreaView className='flex-1 bg-white'>
            <CreditTopTabs />

            <ScrollView className='flex-1'>
                <RecordPaymentForm
                    customerName={customerSearchQuery}
                    onCustomerNameChange={setCustomerSearchQuery}
                    amountPaid={amountPaid}
                    onAmountPaidChange={setAmountPaid}
                    showSuggestions={customerSearchQuery.length > 0 && !selectedCustomer}
                    suggestedCustomers={suggestedCustomers}
                    onSelectCustomer={handleSelectCustomer}
                    onRecord={handleRecordPress}
                    selectedCustomer={selectedCustomer}
                    requireCustomer={true}
                />
                <CreditSummarySection
                    totalAmount={totalCreditAmount}
                    showCreditRating={showCreditRating}
                    onCloseCreditRating={() => setShowCreditRating(false)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {isLoading ? (
                    <View className='flex-1 items-center justify-center py-12'>
                        <ActivityIndicator size='large' color='#000' />
                        <Text className='mt-4 text-gray-500'>Loading customers...</Text>
                    </View>
                ) : customers.length === 0 ? (
                    <View className='flex-1 items-center justify-center py-12'>
                        <Ionicons name='people-outline' size={48} color='#9CA3AF' />
                        <Text className='mt-4 text-gray-500 text-center px-4'>
                            {searchQuery
                                ? 'No customers found matching your search'
                                : 'No customers with outstanding credit'}
                        </Text>
                    </View>
                ) : (
                    <View className='px-4'>
                        {customers.map((customer) => {
                            const rating = getCreditRating(customer.currentBalance);
                            const dueTimestamp = saleDueMap[customer.id] ?? null;
                            // compute days left/overdue from timestamp
                            const daysLeft = computeDaysDue(dueTimestamp);

                            let daysStatusText = '';
                            if (typeof daysLeft === 'number') {
                                if (daysLeft < 0) {
                                    daysStatusText = `${Math.abs(daysLeft)} days overdue`;
                                } else {
                                    daysStatusText = `${daysLeft} days left`;
                                }
                            }

                            // format due date string for display if we have a timestamp
                            const dueDateStr = dueTimestamp
                                ? new Date(dueTimestamp).toLocaleDateString()
                                : '';

                            return (
                                <CustomerCreditItem
                                    key={customer.externalId}
                                    customer={customer}
                                    onPress={handleCustomerPress}
                                    rating={rating}
                                    dueDate={dueDateStr}
                                    amount={customer.currentBalance}
                                    daysStatus={daysStatusText}
                                    daysLeft={daysLeft ?? 0}
                                />
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreditScreen;
