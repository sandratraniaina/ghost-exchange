import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, YStack, Input } from 'tamagui';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('sandratra2468@gmail.com');
    const [password, setPassword] = useState('Here is a 8 letters pwd');

    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
            router.replace('/');
        } catch (error) {
            setError(error.message)
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <YStack gap="$4" width={300}>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>Login</Text>
                <Input
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={{ borderWidth: 1, padding: 10 }}
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ borderWidth: 1, padding: 10 }}
                />
                {
                    error &&
                    <Text >{error}</Text>
                }
                <Button
                    backgroundColor="#1D88AF"
                    color="white"
                    onPress={handleLogin}
                >
                    Login
                </Button>
            </YStack>
        </View>
    );
}
