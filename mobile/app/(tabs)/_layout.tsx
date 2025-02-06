import { Tabs } from 'expo-router';
import { Home, User } from '@tamagui/lucide-icons';

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
                name="profile"
                options={{
                    tabBarIcon: ({ color }) => <User color={color} />,
                    tabBarLabel: 'Profile'
                }}
            />
        </Tabs> 
    );
}