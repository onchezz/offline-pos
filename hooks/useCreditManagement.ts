import { useState, useMemo } from 'react';
import { Customer } from '@/types';

export const useCreditManagement = (customers: Customer[]) => {
    const [customerName, setCustomerName] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreditRating, setShowCreditRating] = useState(true);

    const totalAmount = useMemo(
        () => customers.reduce((sum, customer) => sum + customer.amount, 0),
        [customers],
    );

    const filteredCustomers = useMemo(
        () =>
            customers.filter((customer) => {
                const fullName = `${customer.name}`.toLowerCase();
                const query = searchQuery.toLowerCase();
                return fullName.includes(query) || customer.phone.includes(query);
            }),
        [customers, searchQuery],
    );

    const suggestedCustomers = useMemo(
        () =>
            customers.filter((customer) => {
                const fullName = `${customer.name}`.toLowerCase();
                return fullName.includes(customerName.toLowerCase());
            }),
        [customers, customerName],
    );

    const handleCustomerNameChange = (text: string) => {
        setCustomerName(text);
        setShowSuggestions(text.length > 0);
    };

    const handleSelectCustomer = (customer: Customer) => {
        setCustomerName(`${customer.name}`);
        setShowSuggestions(false);
    };

    const handleRecordPayment = () => {
        console.log('Recording payment:', { customerName, amountPaid });
        setCustomerName('');
        setAmountPaid('');
    };

    return {
        customerName,
        amountPaid,
        setAmountPaid,
        showSuggestions,
        searchQuery,
        setSearchQuery,
        showCreditRating,
        setShowCreditRating,
        totalAmount,
        filteredCustomers,
        suggestedCustomers,
        handleCustomerNameChange,
        handleSelectCustomer,
        handleRecordPayment,
    };
};
