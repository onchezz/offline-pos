import { useBusiness } from '@/contexts/BusinessContext';
import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {
    // optional callback that will be called after a store is selected
    onSelect?: (storeId: string) => void;
    // when true use the native picker component (from @react-native-picker/picker)
    useNativePicker?: boolean;
};

const StoreSwitcher: React.FC<Props> = ({ onSelect }) => {
    const { stores, selectedStore, selectStore } = useBusiness();

    if (!stores || stores.length === 0) {
        return (
            <View>
                <Text className='text-gray-500'>No stores available</Text>
            </View>
        );
    }

    return (
        <View>
            <Text className='text-lg font-semibold mb-2'>Active Stores</Text>
            <View className='border border-gray-200 rounded-lg overflow-hidden'>
                <Picker
                    selectedValue={selectedStore?.id ?? ''}
                    style={{ fontSize: 5, justifyContent: 'center' }}
                    mode={'dropdown'}
                    onValueChange={(value) => {
                        if (!value) return;
                        selectStore(value);
                        if (onSelect) onSelect(value);
                    }}>
                    {stores.map((s) => (
                        <Picker.Item
                            label={s.displayName || s.name || 'Untitled'}
                            value={s.id}
                            key={s.id}
                            style={{ fontSize: 16 }}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
};

export default StoreSwitcher;
