import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button, YStack } from 'tamagui';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        login(email, password);
        router.replace('/');
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <YStack space="$4" width={300}>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>Login</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={{ borderWidth: 1, padding: 10 }}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ borderWidth: 1, padding: 10 }}
                />
                <Button onPress={handleLogin}>Login</Button>
            </YStack>
        </View>
    );
}
