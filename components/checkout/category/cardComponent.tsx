import * as React from 'react';
import { Text, TextProps, View, ViewProps } from 'react-native';

// Simple cn utility function without external dependencies
export function cn(...inputs: (string | undefined | null | false)[]): string {
    return inputs.filter(Boolean).join(' ');
}

// Card Components
function Card({ className, ...props }: ViewProps & { className?: string }) {
    return (
        <View
            className={cn('bg-card flex flex-col gap-6 rounded-xl border border-border', className)}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: ViewProps & { className?: string }) {
    return <View className={cn('flex-row items-start gap-1.5 px-6 pt-6', className)} {...props} />;
}

function CardTitle({ className, ...props }: TextProps & { className?: string }) {
    return (
        <Text
            className={cn('text-card-foreground leading-none font-semibold text-lg', className)}
            {...props}
        />
    );
}

function CardDescription({ className, ...props }: TextProps & { className?: string }) {
    return <Text className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function CardAction({ className, ...props }: ViewProps & { className?: string }) {
    return <View className={cn('ml-auto', className)} {...props} />;
}

function CardContent({ className, ...props }: ViewProps & { className?: string }) {
    return <View className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: ViewProps & { className?: string }) {
    return <View className={cn('flex-row items-center px-6 pb-6', className)} {...props} />;
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
