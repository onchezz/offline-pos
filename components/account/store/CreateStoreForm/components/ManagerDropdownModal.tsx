import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ModalBase } from './ModalBase';

type ManagerOption = { id: string; name: string; role?: string };

export const ManagerDropdownModal: React.FC<{
    visible: boolean;
    onClose: () => void;
    value: string;
    onSelect: (value: string) => void;
    managers: ManagerOption[];
}> = ({ visible, onClose, value, onSelect, managers }) => (
    <ModalBase visible={visible} onClose={onClose} title='Select Manager' maxHeight='60%'>
        <ScrollView className='px-4 py-3'>
            <TouchableOpacity
                className='py-3 px-3 rounded-md'
                onPress={() => {
                    onSelect('');
                    onClose();
                }}>
                <Text className='text-sm text-gray-400'>No manager</Text>
            </TouchableOpacity>

            {managers.map((manager) => (
                <TouchableOpacity
                    key={manager.id}
                    className={`py-3 px-3 rounded-md ${value === manager.id ? 'bg-gray-100' : ''}`}
                    onPress={() => {
                        onSelect(manager.id);
                        onClose();
                    }}>
                    <View className='flex-row items-center gap-2'>
                        <Text className='text-xl'>{manager.name}</Text>
                        <View>
                            <Text
                                className={`text-sm ${
                                    value === manager.id ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                {manager.name}
                            </Text>
                            {manager.role ? (
                                <Text className='text-xs text-gray-500'>Role: {manager.role}</Text>
                            ) : (
                                <Text className='text-xs text-gray-500'>ID: {manager.id}</Text>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </ScrollView>
    </ModalBase>
);
