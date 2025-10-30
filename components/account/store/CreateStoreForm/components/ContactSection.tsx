import React from 'react';
import { Text, View } from 'react-native';
import { CustomInput, CustomLabel, Selector } from './BasicUIComponents';
import { COUNTRY_CODES } from './constants';

interface ContactSectionProps {
    address: string;
    onAddressChange: (text: string) => void;
    countryCode: string;
    selectedCountry: (typeof COUNTRY_CODES)[0];
    onCountryCodePress: () => void;
    phone: string;
    onPhoneChange: (text: string) => void;
    email: string;
    onEmailChange: (text: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
    address,
    onAddressChange,
    countryCode,
    selectedCountry,
    onCountryCodePress,
    phone,
    onPhoneChange,
    email,
    onEmailChange,
}) => (
    <View className='pt-5 pb-5'>
        <Text className='text-base font-semibold text-gray-900 mb-3'>Contact Details</Text>

        <View className='mb-3'>
            <CustomLabel>Address</CustomLabel>
            <CustomInput
                value={address}
                onChangeText={onAddressChange}
                placeholder='123 Main Street, City'
            />
        </View>

        <View className='flex-row gap-2 mb-3'>
            <View className='flex-1'>
                <CustomLabel>Code</CustomLabel>
                <Selector onPress={onCountryCodePress}>
                    <Text className='text-sm text-gray-900'>
                        {selectedCountry.flag} {countryCode}
                    </Text>
                </Selector>
            </View>

            <View className='flex-[2]'>
                <CustomLabel>Phone</CustomLabel>
                <CustomInput
                    value={phone}
                    onChangeText={onPhoneChange}
                    placeholder='712345678'
                    keyboardType='phone-pad'
                />
            </View>
        </View>

        <View className='mb-3'>
            <CustomLabel>Email (optional)</CustomLabel>
            <CustomInput
                value={email}
                onChangeText={onEmailChange}
                placeholder='store@example.com'
                keyboardType='email-address'
                autoCapitalize='none'
            />
        </View>
    </View>
);
