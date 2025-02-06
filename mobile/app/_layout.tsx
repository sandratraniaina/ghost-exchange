import { Stack } from 'expo-router';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from "@tamagui/config/v4";
import { AuthProvider } from '@/context/AuthContext';

const config = createTamagui(defaultConfig);

export default function Layout() {
    return (
        <AuthProvider>
            <TamaguiProvider config={config}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="login" options={{ presentation: 'modal' }} />
                </Stack>
            </TamaguiProvider>
        </AuthProvider>
    );
}