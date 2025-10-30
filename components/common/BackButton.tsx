import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

interface BackButtonProps {
    onPress: () => void;
    size?: number;
    color?: string;
    className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
    onPress,
    size = 24,
    color = '#1F2937',
    className = 'mr-4',
}) => {
    return (
        <TouchableOpacity onPress={onPress} className={className}>
            <ArrowLeft size={size} color={color} />
        </TouchableOpacity>
    );
};
