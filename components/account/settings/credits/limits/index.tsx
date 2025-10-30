import { CreditLimitsData } from '@/types';
import { useState } from 'react';
import { ScrollView } from 'react-native';
import { CreditLimitsForm } from './CreditLimitsForm';
import { CurrentSettingsSummary } from './CurrentSettings';
import { SaveButton } from './SaveButton';

interface CreditLimitsTabProps {
    onSave?: (data: CreditLimitsData) => void;
}

export const CreditLimitsTab: React.FC<CreditLimitsTabProps> = ({ onSave }) => {
    const [maxPerCustomer, setMaxPerCustomer] = useState('500');
    const [maxPerTransaction, setMaxPerTransaction] = useState('100');
    const [creditDays, setCreditDays] = useState('30');

    const handleSave = () => {
        const data: CreditLimitsData = {
            maxPerCustomer,
            maxPerTransaction,
            creditDays,
        };
        onSave?.(data);
        console.log('Saving credit limits:', data);
    };

    return (
        <ScrollView className='flex-1'>
            <CurrentSettingsSummary
                maxPerCustomer={maxPerCustomer}
                maxPerTransaction={maxPerTransaction}
                creditDays={creditDays}
            />

            <CreditLimitsForm
                maxPerCustomer={maxPerCustomer}
                setMaxPerCustomer={setMaxPerCustomer}
                maxPerTransaction={maxPerTransaction}
                setMaxPerTransaction={setMaxPerTransaction}
                creditDays={creditDays}
                setCreditDays={setCreditDays}
            />

            <SaveButton onPress={handleSave} />
        </ScrollView>
    );
};
