import { useRouter } from 'expo-router';
import { View, Text } from 'react-native';
import { Button } from 'tamagui';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24 }}>Home Screen</Text>
            <Button theme="active" onPress={() => router.push('/login')}>
                Click Me
            </Button>
        </View>
    );
}
