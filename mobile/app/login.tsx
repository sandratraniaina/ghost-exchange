import { useRouter } from 'expo-router';
import { View, Text, TextInput } from 'react-native';
import { Button, YStack } from 'tamagui';

export default function LoginScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <YStack space="$4" width={300}>
                <Text style={{ fontSize: 24, textAlign: 'center' }}>Login</Text>
                <TextInput placeholder="Email" style={{ borderWidth: 1, padding: 10 }} />
                <TextInput placeholder="Password" secureTextEntry style={{ borderWidth: 1, padding: 10 }} />
                <Button onPress={() => router.back()}>Login</Button>
            </YStack>
        </View>
    );
}
