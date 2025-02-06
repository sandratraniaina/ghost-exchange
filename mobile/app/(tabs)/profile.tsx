import ProfileImage from '@/components/ProfileImage';
import { useAuth } from '@/hooks/useAuth';
import { View } from 'react-native';
import { YStack, Text, Button } from 'tamagui';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={{ flex: 1, padding: 20, height: "100%" }}>
            <YStack gap="$4" alignItems="center" height="100%">
                <ProfileImage></ProfileImage>
                <Text fontSize={24} fontWeight="bold">{user?.username}</Text>
                <Text fontSize={16}>{user?.email}</Text>
                <Text fontSize={20} fontWeight="bold">
                    Balance: ${user?.balance.toFixed(2)}
                </Text>
                <Button theme="red" onPress={logout}>Logout</Button>
            </YStack>
        </View>
    );
}
