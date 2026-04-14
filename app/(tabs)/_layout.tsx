import { Tabs } from 'expo-router';
import { 
  LayoutDashboard, 
  Layers,
  UserCircle,
  CircleUser
} from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FF5722', // Hardware Haven Orange
                tabBarInactiveTintColor: '#64748b', // Slate 500
                headerShown: false,
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: Platform.OS === 'android' ? 8 : 0,
                },
                tabBarStyle: {
                    height: Platform.OS === 'android' ? 70 : 88,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f1f5f9',
                    elevation: 0,
                    shadowOpacity: 0,
                    paddingTop: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                title: 'Feed',
                tabBarIcon: ({ color, focused }) => (
                    <LayoutDashboard 
                    size={24} 
                    color={color} 
                    strokeWidth={focused ? 2.5 : 2} 
                    />
                ),
                }}
            />

            <Tabs.Screen
                name="catalog"
                options={{
                title: 'Catalog',
                tabBarIcon: ({ color, focused }) => (
                    <Layers 
                    size={24} 
                    color={color} 
                    strokeWidth={focused ? 2.5 : 2} 
                    />
                ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                title: 'Account',
                tabBarIcon: ({ color, focused }) => (
                    <UserCircle 
                    size={24} 
                    color={color} 
                    strokeWidth={focused ? 2.5 : 2} 
                    />
                ),
                }}
            />
        </Tabs>
    );
}