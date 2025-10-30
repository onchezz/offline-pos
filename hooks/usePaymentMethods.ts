import { PaymentMethod } from '@/types';
import { CreditCard, DollarSign, Smartphone, Wallet } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Animated } from 'react-native';

export const usePaymentMethods = () => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cash');
    const [showStoreCreditForm, setShowStoreCreditForm] = useState(false);
    const [creditAmount, setCreditAmount] = useState('');

    // Animation values
    const storeCreditFormHeight = useRef(new Animated.Value(0)).current;
    const storeCreditOpacity = useRef(new Animated.Value(0)).current;

    const paymentMethods: PaymentMethod[] = [
        {
            id: 'mpesa',
            name: 'M-Pesa',
            description: 'Pay with mobile money',
            icon: Smartphone,
            color: '#fdfdfdff',
            bgColor: '#0fb94bff',
        },
        {
            id: 'store-credit',
            name: 'Store Credit',
            description: 'Use customer credit',
            icon: CreditCard,
            color: '#fdfdfdff',
            bgColor: '#4687dbff',
        },
        {
            id: 'cash',
            name: 'Cash',
            description: 'Cash payment',
            icon: DollarSign,
            color: '#f3f3f3ff',
            bgColor: '#f5880cff',
        },
        {
            id: 'card',
            name: 'Card',
            description: 'Card payment',
            icon: Wallet,
            color: '#f3f3f3ff',
            bgColor: '#5c2df4ff',
        },
    ];

    const handlePaymentMethodSelect = (methodId: string) => {
        setSelectedPaymentMethod(methodId);

        if (methodId === 'store-credit') {
            setShowStoreCreditForm(true);
            // Animate form appearance
            Animated.parallel([
                Animated.timing(storeCreditFormHeight, {
                    toValue: 200,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(storeCreditOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            setShowStoreCreditForm(false);
            // Animate form disappearance
            Animated.parallel([
                Animated.timing(storeCreditFormHeight, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(storeCreditOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    };

    return {
        paymentMethods,
        selectedPaymentMethod,
        showStoreCreditForm,
        creditAmount,
        setCreditAmount,
        storeCreditFormHeight,
        storeCreditOpacity,
        handlePaymentMethodSelect,
    };
};
