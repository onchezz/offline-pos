import React, { useRef } from 'react';
import { TouchableOpacity, Animated, View, Text } from 'react-native';
import { PaymentMethod } from '@/types';

interface PaymentMethodCardProps {
    method: PaymentMethod;
    isSelected: boolean;
    onSelect: (methodId: string) => void;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
    method,
    isSelected,
    onSelect,
}) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.98,
            useNativeDriver: true,
            tension: 400,
            friction: 10,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 400,
            friction: 10,
        }).start();
    };

    const IconComponent = method.icon;

    return (
        <TouchableOpacity
            onPress={() => onSelect(method.id)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.95}
            className='mb-3'>
            <Animated.View
                className={`bg-white rounded-xl p-4 border-2 ${
                    isSelected ? 'border-gray-900' : 'border-transparent'
                }`}
                style={{
                    transform: [{ scale: scaleValue }],
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: isSelected ? 0.1 : 0.05,
                    shadowRadius: isSelected ? 6 : 4,
                    elevation: isSelected ? 4 : 2,
                }}>
                <View className='flex-row items-center'>
                    <View
                        className='w-10 h-10 rounded-lg items-center justify-center mr-3'
                        style={{ backgroundColor: method.bgColor }}>
                        <IconComponent size={20} color={method.color} />
                    </View>
                    <View className='flex-1'>
                        <Text className='text-gray-900 font-semibold text-base mb-1'>
                            {method.name}
                        </Text>
                        <Text className='text-gray-500 text-sm'>{method.description}</Text>
                    </View>
                    {isSelected && (
                        <View className='w-6 h-6 bg-gray-900 rounded-full items-center justify-center'>
                            <View className='w-2 h-2 bg-white rounded-full' />
                        </View>
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};
