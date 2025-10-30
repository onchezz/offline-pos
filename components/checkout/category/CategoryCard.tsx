import { Category } from '@/types';
import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

interface CategoryCardProps {
    category: Category;
    onPress: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    const [isPressed, setIsPressed] = React.useState(false);

    const handlePressIn = (): void => {
        setIsPressed(true);
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const handlePressOut = (): void => {
        setIsPressed(false);
        Animated.spring(scaleValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 300,
            friction: 10,
        }).start();
    };

    const handlePress = (): void => {
        console.log(`Selected category: ${category.name}`);
        onPress(category);
    };

    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            activeOpacity={1} // Disable default opacity change
            className='flex-1 min-w-[45%] max-w-[45%] m-2'>
            <Animated.View
                // className={`${category.color} rounded-2xl p-4`}
                className={`bg-white rounded-xl py-4 pl-2`}
                style={{
                    transform: [{ scale: scaleValue }],
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: isPressed ? 6 : 4,
                    },
                    shadowOpacity: isPressed ? 0.15 : 0.1,
                    shadowRadius: isPressed ? 8 : 6,
                    elevation: isPressed ? 2.5 : 1.5,
                }}>
                <View className='flex-row items-center justify-between mb-2'>
                    <View className='flex-row items-center space-x-2'>
                        <Text className='text-xs'>{category.icon}</Text>
                        <Text className='text-gray-800 font-medium text-sm ml-2'>
                            {category.name}
                        </Text>
                    </View>

                    <Animated.View
                        className='bg-white rounded-full px-2 py-1'
                        style={{
                            transform: [{ scale: scaleValue }],
                        }}>
                        <Text className='text-xs font-medium text-gray-600'>{category.count}</Text>
                    </Animated.View>
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
};

export default CategoryCard;
