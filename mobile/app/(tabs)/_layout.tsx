import { Tabs } from 'expo-router';
import { Home, User, Bitcoin } from '@tamagui/lucide-icons';

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ color }) => <Home color={color} />,
                    tabBarLabel: 'Home'
                }}
            />
            <Tabs.Screen
                name="crypto"
                options={{
                    tabBarIcon: ({ color }) => <Bitcoin color={color} />,
                    tabBarLabel: 'Favorites'
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => <User color={color} />,
                    tabBarLabel: 'Profile'
                }}
            />
        </Tabs>
    );
}