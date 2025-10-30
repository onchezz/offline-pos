import { FilterState } from '@/types';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface FilterButtonProps {
    type: keyof FilterState;
    isActive: boolean;
    onPress: () => void;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ type, isActive, onPress }) => {
    const getButtonConfig = () => {
        switch (type) {
            case 'Low':
                return {
                    icon: (
                        <MaterialIcons
                            name='low-priority'
                            size={14}
                            color={isActive ? 'white' : '#3B82F6'}
                        />
                    ),
                    text: 'Low',
                    activeClass: 'bg-blue-600',
                    inactiveClass: 'bg-blue-100',
                    activeTextClass: 'text-white',
                    inactiveTextClass: 'text-blue-600',
                };
            case 'Out':
                return {
                    icon: (
                        <Feather name='calendar' size={14} color={isActive ? 'white' : '#6B7280'} />
                    ),
                    text: 'Out',
                    activeClass: 'bg-gray-800',
                    inactiveClass: 'bg-gray-100',
                    activeTextClass: 'text-white',
                    inactiveTextClass: 'text-gray-600',
                };
            case 'Ordered':
                return {
                    icon: (
                        <Feather
                            name='shopping-cart'
                            size={14}
                            color={isActive ? 'white' : '#6B7280'}
                        />
                    ),
                    text: 'Ordered',
                    activeClass: 'bg-gray-800',
                    inactiveClass: 'bg-gray-100',
                    activeTextClass: 'text-white',
                    inactiveTextClass: 'text-gray-600',
                };
        }
    };

    const config = getButtonConfig();

    return (
        <TouchableOpacity
            className={`flex-row items-center px-2 py-2 rounded-lg mr-2 ${
                isActive ? config?.activeClass : config?.inactiveClass
            }`}
            onPress={onPress}>
            {config?.icon}
            <Text
                className={`font-medium ml-1 text-xs ${
                    isActive ? config?.activeTextClass : config?.inactiveTextClass
                }`}>
                {config?.text}
            </Text>
        </TouchableOpacity>
    );
};
