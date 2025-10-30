import { useState } from 'react';

export const useTransactionPayment = () => {
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleSubmit = () => {
        console.log('Processing payment:', { paymentAmount, paymentMethod });
        // TODO: Process payment
        setPaymentAmount('');
        setPaymentMethod('');
    };

    const resetForm = () => {
        setPaymentAmount('');
        setPaymentMethod('');
    };

    return {
        paymentAmount,
        setPaymentAmount,
        paymentMethod,
        setPaymentMethod,
        handleSubmit,
        resetForm,
    };
};
