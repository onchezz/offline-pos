import { useState } from 'react';
import { Customer } from '@/types';

type CreditScreen = 'list' | 'detail';

export const useCreditNavigation = () => {
    const [currentScreen, setCurrentScreen] = useState<CreditScreen>('list');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const navigateToDetail = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCurrentScreen('detail');
    };

    const navigateBack = () => {
        setSelectedCustomer(null);
        setCurrentScreen('list');
    };

    return {
        currentScreen,
        selectedCustomer,
        navigateToDetail,
        navigateBack,
    };
};
