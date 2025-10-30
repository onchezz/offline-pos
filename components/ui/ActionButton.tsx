import { SizeConfig, VariantConfig } from '@/types';
import { ArrowLeft, LucideIcon, Minus, Plus, Search, ShoppingCart } from 'lucide-react-native';
import React, { useRef } from 'react';
import { Animated, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ActionButtonProps {
    onPress: () => void;

    // Content
    text?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right' | 'only';

    // Styling
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    shape?: 'rectangle' | 'rounded' | 'pill' | 'circle';

    // States
    disabled?: boolean;
    loading?: boolean;

    // Animation
    animationScale?: number;
    animationTension?: number;
    animationFriction?: number;

    // Layout
    fullWidth?: boolean;
    className?: string;
    style?: ViewStyle;

    // Accessibility
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    onPress,
    text,
    icon: Icon,
    iconPosition = 'left',
    variant = 'primary',
    size = 'md',
    shape = 'rounded',
    disabled = false,
    loading = false,
    animationScale = 0.95,
    animationTension = 300,
    animationFriction = 10,
    fullWidth = false,
    className = '',
    style,
    accessibilityLabel,
    accessibilityHint,
}) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    // Size configurations
    const sizeConfigs: Record<string, SizeConfig> = {
        xs: {
            padding: 'px-2 py-1',
            iconSize: 10,
            textSize: 'text-xs',
            minWidth: 'min-w-[32px]',
            height: 'h-6',
        },
        sm: {
            padding: 'px-3 py-1.5',
            iconSize: 12,
            textSize: 'text-xs',
            minWidth: 'min-w-[40px]',
            height: 'h-8',
        },
        md: {
            padding: 'px-4 py-2',
            iconSize: 14,
            textSize: 'text-sm',
            minWidth: 'min-w-[44px]',
            height: 'h-10',
        },
        lg: {
            padding: 'px-6 py-3',
            iconSize: 16,
            textSize: 'text-base',
            minWidth: 'min-w-[48px]',
            height: 'h-12',
        },
        xl: {
            padding: 'px-8 py-4',
            iconSize: 20,
            textSize: 'text-lg',
            minWidth: 'min-w-[56px]',
            height: 'h-16',
        },
    };

    // Variant configurations
    const variantConfigs: Record<string, VariantConfig> = {
        primary: {
            bg: 'bg-gray-900',
            bgDisabled: 'bg-gray-400',
            textColor: 'text-white',
            textColorDisabled: 'text-gray-200',
            iconColor: '#FFFFFF',
            iconColorDisabled: '#E5E7EB',
        },
        secondary: {
            bg: 'bg-gray-200',
            bgDisabled: 'bg-gray-100',
            textColor: 'text-gray-900',
            textColorDisabled: 'text-gray-400',
            iconColor: '#374151',
            iconColorDisabled: '#9CA3AF',
        },
        outline: {
            bg: 'bg-transparent border-2 border-gray-900',
            bgDisabled: 'bg-transparent border-2 border-gray-300',
            textColor: 'text-gray-900',
            textColorDisabled: 'text-gray-400',
            iconColor: '#374151',
            iconColorDisabled: '#9CA3AF',
        },
        ghost: {
            bg: 'bg-transparent',
            bgDisabled: 'bg-transparent',
            textColor: 'text-gray-700',
            textColorDisabled: 'text-gray-400',
            iconColor: '#374151',
            iconColorDisabled: '#9CA3AF',
        },
        danger: {
            bg: 'bg-red-600',
            bgDisabled: 'bg-red-300',
            textColor: 'text-white',
            textColorDisabled: 'text-red-100',
            iconColor: '#FFFFFF',
            iconColorDisabled: '#FCA5A5',
        },
    };

    // Shape configurations
    const shapeConfigs: Record<string, string> = {
        rectangle: '',
        rounded: 'rounded-lg',
        pill: 'rounded-full',
        circle: 'rounded-full',
    };

    // Get configurations
    const sizeConfig = sizeConfigs[size];
    const variantConfig = variantConfigs[variant];
    const shapeClass = shapeConfigs[shape];

    // Handle press animations
    const handlePressIn = () => {
        if (!disabled && !loading) {
            Animated.spring(scaleValue, {
                toValue: animationScale,
                useNativeDriver: true,
                tension: animationTension,
                friction: animationFriction,
            }).start();
        }
    };

    const handlePressOut = () => {
        if (!disabled && !loading) {
            Animated.spring(scaleValue, {
                toValue: 1,
                useNativeDriver: true,
                tension: animationTension,
                friction: animationFriction,
            }).start();
        }
    };

    const handlePress = () => {
        if (!disabled && !loading) {
            onPress();
        }
    };

    // Determine content layout
    const isIconOnly = iconPosition === 'only' || (!text && Icon);
    const showText = text && iconPosition !== 'only';
    const showIcon = Icon && !loading;

    // Build class names
    const baseClasses = [
        sizeConfig.padding,
        disabled ? variantConfig.bgDisabled : variantConfig.bg,
        shapeClass,
        'items-center justify-center',
        fullWidth ? 'w-full' : sizeConfig.minWidth,
        shape === 'circle'
            ? `${sizeConfig.height} w-${sizeConfig?.height?.split('-')[1]}`
            : sizeConfig.height,
        isIconOnly ? 'aspect-square' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const textColorClass = disabled ? variantConfig.textColorDisabled : variantConfig.textColor;
    const iconColor = disabled ? variantConfig.iconColorDisabled : variantConfig.iconColor;

    return (
        <TouchableOpacity
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            activeOpacity={0.8}
            accessibilityLabel={accessibilityLabel || text}
            accessibilityHint={accessibilityHint}
            accessibilityRole='button'
            accessibilityState={{ disabled: disabled || loading }}>
            <Animated.View
                className={baseClasses}
                style={[
                    {
                        transform: [{ scale: scaleValue }],
                    },
                    style,
                ]}>
                {loading ? (
                    <View className='flex-row items-center'>
                        {/* Simple loading indicator - you could replace with a spinner */}
                        <Text className={`${textColorClass} ${sizeConfig.textSize} font-medium`}>
                            Loading...
                        </Text>
                    </View>
                ) : (
                    <View className={`flex-row items-center ${isIconOnly ? 'justify-center' : ''}`}>
                        {showIcon && iconPosition === 'left' && (
                            <Icon size={sizeConfig.iconSize} color={iconColor} />
                        )}

                        {showText && (
                            <Text
                                className={`${textColorClass} ${sizeConfig.textSize} font-medium ${
                                    showIcon && iconPosition === 'left' ? 'ml-1' : ''
                                } ${showIcon && iconPosition === 'right' ? 'mr-1' : ''}`}>
                                {text}
                            </Text>
                        )}

                        {showIcon && iconPosition === 'right' && (
                            <Icon size={sizeConfig.iconSize} color={iconColor} />
                        )}

                        {isIconOnly && showIcon && (
                            <Icon size={sizeConfig.iconSize} color={iconColor} />
                        )}
                    </View>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

// Pre-configured button variants
export const AddButton: React.FC<Omit<ActionButtonProps, 'icon' | 'text'> & { text?: string }> = (
    props,
) => <ActionButton icon={Plus} text={props.text || 'Add'} variant='primary' {...props} />;

export const RemoveButton: React.FC<Omit<ActionButtonProps, 'icon'>> = (props) => (
    <ActionButton
        icon={Minus}
        iconPosition='only'
        variant='secondary'
        shape='circle'
        size='sm'
        {...props}
    />
);

export const CartButton: React.FC<
    Omit<ActionButtonProps, 'icon' | 'text'> & { text?: string; itemCount?: number }
> = ({ itemCount, text, ...props }) => (
    <ActionButton
        icon={ShoppingCart}
        text={text || (itemCount ? `Cart (${itemCount})` : 'Cart')}
        variant='primary'
        {...props}
    />
);

export const BackButton: React.FC<Omit<ActionButtonProps, 'icon' | 'iconPosition'>> = (props) => (
    <ActionButton
        icon={ArrowLeft}
        iconPosition='only'
        variant='ghost'
        shape='circle'
        size='md'
        {...props}
    />
);

export const SearchButton: React.FC<Omit<ActionButtonProps, 'icon' | 'iconPosition'>> = (props) => (
    <ActionButton
        icon={Search}
        iconPosition='only'
        variant='secondary'
        shape='circle'
        size='md'
        {...props}
    />
);
