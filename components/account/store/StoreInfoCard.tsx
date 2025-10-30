import StoreForm from '@/components/account/store/CreateStoreForm/StoreForm';
import StoreSwitcher from '@/components/StoreSwitcher';
import Business from '@/db/models/business';
import Store from '@/db/models/stores';
import { storeService } from '@/db/services/storeService';
import { Edit, Store as StoreIcon } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoreData } from './CreateStoreForm/types';

interface StoreInfoCardProps {
    store: Store | null;
    business: Business | null;
    onStoreEditPress: (storeExternalId: string) => void;
    onSwitchStore: () => void;
}

export const StoreInfoCard: React.FC<StoreInfoCardProps> = ({
    store,
    business,
    onStoreEditPress,
    onSwitchStore,
}) => {
    const [adding, setAdding] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSwitcher, setShowSwitcher] = useState(false);
    if (!store || !business) return <Text>No store selected</Text>;
    const handleCreateStore = async (data: StoreData) => {
        if (!business) return;
        setLoading(true);
        try {
            const created = await storeService.createStore(business.id, data);

            if (created) {
                // Close modal and optionally switch to the new store
                setAdding(false);
                // select the new store in the app
                try {
                    storeService.selectStore(created.id);
                } catch (err) {
                    console.warn('select store after create failed', err);
                }
            }
        } catch (e) {
            console.error('Error creating store', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className='mb-4 rounded-2xl bg-white p-4 shadow-sm'>
            <View className='flex-row justify-between items-center mb-3'>
                <View className='flex-row items-center'>
                    <StoreIcon size={20} color='#374151' />
                    <Text className='ml-2 font-semibold text-gray-900'>Store Information</Text>
                </View>
                <TouchableOpacity onPress={() => onStoreEditPress(store.externalId!)}>
                    <Edit size={20} color='#374151' />
                </TouchableOpacity>
            </View>

            <Text className='font-semibold text-gray-900 text-base mb-1'>{store.name}</Text>
            <Text className='text-sm text-gray-500 mb-3'>Business: {business.name}</Text>

            <View className='mt-3'>
                <StoreSwitcher onSelect={() => setShowSwitcher(false)} />
            </View>

            <View className='mt-3'>
                <TouchableOpacity
                    onPress={() => setAdding(true)}
                    className='border border-dashed border-gray-300 rounded-lg p-3 items-center'>
                    <Text className='text-sm text-gray-700'>+ Add another store</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={adding} animationType='slide' onRequestClose={() => setAdding(false)}>
                <SafeAreaView className='flex-1 p-4 bg-white mt-4'>
                    <View className='flex-row justify-between items-center mb-4'>
                        <Text className='text-lg font-semibold'>Add Store</Text>
                        <TouchableOpacity onPress={() => setAdding(false)}>
                            <Text className='text-gray-600'>Close</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View className='flex-1 justify-center items-center'>
                            <ActivityIndicator size='large' color='#111827' />
                        </View>
                    ) : (
                        <StoreForm
                            createDirect={false}
                            showFooterButtons={true}
                            onCancel={() => setAdding(false)}
                            onCreate={handleCreateStore}
                            users={[]}
                        />
                    )}
                </SafeAreaView>
            </Modal>

            {/* end inline switcher */}
        </View>
    );
};
