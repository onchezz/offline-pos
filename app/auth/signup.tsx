import { AuthHeader } from '@/components/auth/AuthHeader';
import { BusinessInfoForm } from '@/components/auth/BusinessInfoForm';
import { PersonalInfoForm } from '@/components/auth/PersonalInfoForm';
import { SignUpCard } from '@/components/auth/SignUpCard';
import { createBusinessWithStore } from '@/db/services/businessService';
import { createUser } from '@/db/services/userService';

// import { createBusinessWithStore } from '@/models/db/services/businessService';
// import { createUser } from '@/models/db/services/userService';
import { StoreData, UserData } from '@/types';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function CreateAccountScreen() {
    const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal');
    const [personalInfo, setPersonalInfo] = useState<UserData | null>(null);

    const handleContinueToBusiness = async (personalInfo: UserData) => {
        setPersonalInfo(personalInfo);
        setActiveTab('business');

        console.log('user created', personalInfo.name, personalInfo.externalId);
    };

    const handleBackToPersonal = () => {
        setActiveTab('personal');
    };

    const handleCreateAccount = async (businessStoreData: {
        businessName: string;
        store: StoreData;
    }) => {
        if (!personalInfo) return;
        const user = await createUser({
            email: personalInfo.email,
            name: personalInfo.name,
            phone: personalInfo.phone,
            password: personalInfo.password,
            pin: personalInfo.pin,
            isOwner: true,
        });

        console.log('user created', user.id, user.externalId);
        if (!user) {
            console.log('Account creation failed');
            return;
        }
        console.warn('creating business with', businessStoreData);

        // create business and store for this user and select them in the app
        const { business, store } = await createBusinessWithStore({
            businessName: businessStoreData.businessName,
            store: businessStoreData.store,
            ownerId: user.id,
        });
        if (!business || !store) {
            console.error('Failed to create business and/or store for new user');
            return;
        }

        // navigate the user into the main app (root)
        router.replace('/');
    };

    const handleSignIn = () => {
        router.replace('/auth/login');
    };

    return (
        <View className='flex-1 bg-gray-50'>
            <KeyboardAwareScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <AuthHeader title='Create Account' subtitle='Set up your POS system' />

                <View className='px-6 pb-8'>
                    <SignUpCard
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onSignIn={handleSignIn}>
                        {activeTab === 'personal' ? (
                            <PersonalInfoForm onContinue={handleContinueToBusiness} />
                        ) : (
                            <BusinessInfoForm
                                onBack={handleBackToPersonal}
                                onCreateAccount={handleCreateAccount}
                            />
                        )}
                    </SignUpCard>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}
