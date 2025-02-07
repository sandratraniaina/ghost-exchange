import { Tabs } from 'expo-router';
import { Home, User, Bitcoin, History, CreditCard } from '@tamagui/lucide-icons';
import { View } from 'react-native';
import { styled } from 'tamagui';

const HomeButton = styled(View, {
    backgroundColor: '$blue10',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
})

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    position: 'relative',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e5e5',
                },
                tabBarActiveTintColor: '#3498db',
            }}
        >
            <Tabs.Screen
                name="history"
                options={{
                    tabBarIcon: ({ color }) => <History color={color} />,
                    tabBarLabel: 'History'
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
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <HomeButton>
                            <Home color="white" size={24} />
                        </HomeButton>
                    ),
                    tabBarLabel: ''
                }}
            />
            <Tabs.Screen
                name="fiat"
                options={{
                    tabBarIcon: ({ color }) => <CreditCard color={color} />,
                    tabBarLabel: 'Fiat'
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