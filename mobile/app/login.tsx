import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, YStack, Input, Spinner } from 'tamagui';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('ghostexchangetest@gmail.com');
    const [password, setPassword] = useState('Here is a 8 letters pwd');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            await login(email, password);
            router.replace('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
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
                    editable={!isLoading}
                />
                <Input
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ borderWidth: 1, padding: 10 }}
                    editable={!isLoading}
                />
                {error && <Text style={{ color: 'red' }}>{error}</Text>}
                <Button
                    backgroundColor="#1D88AF"
                    color="white"
                    onPress={handleLogin}
                    disabled={isLoading}
                    opacity={isLoading ? 0.7 : 1}
                >
                    <YStack alignItems="center" flexDirection="row" gap="$2">
                        {isLoading && (
                            <Spinner size="small" color="white" />
                        )}
                        <Text style={{ color: 'white' }}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </Text>
                    </YStack>
                </Button>
            </YStack>
        </View>
    );
}