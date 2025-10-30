import { Stack } from 'expo-router';

export default function CheckoutStack() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name='index' />
            <Stack.Screen name='category' />
            <Stack.Screen name='payment' />
        </Stack>
    );
}
