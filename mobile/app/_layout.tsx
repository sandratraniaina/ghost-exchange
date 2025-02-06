import { Stack } from 'expo-router';
import { createTamagui, TamaguiProvider } from 'tamagui';
import { defaultConfig } from "@tamagui/config/v4";

const config = createTamagui(defaultConfig);

export default function Layout() {
    return (
        <TamaguiProvider config={config}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ presentation: 'modal' }} />
            </Stack>
        </TamaguiProvider>
    );
}