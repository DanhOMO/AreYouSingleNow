// Tệp: app/(main)/_layout.tsx

import { Tabs, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@store/useAuthStore'; 
import { useEffect } from 'react';
import { Platform } from 'react-native';

import Header from '@components/Header'; 

export default function MainTabLayout() {
  
  
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.replace('/(auth)/login');
    }
  }, [token]);

  if (!token) return null;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: () => <Header />,

        tabBarActiveTintColor: '#FF6B9A',
        tabBarInactiveTintColor: '#FF6B9A',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          color: '#FF6B9A',
          fontSize: 12,
          marginTop: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          height: 90,
          borderTopWidth: 1,
          borderTopColor: '#FF6B9A',
          paddingBottom: Platform.OS === 'ios' ? 30 : 20,
          backgroundColor: '#fff',
        },

     
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name'];
          const iconSize = 26;

          if (route.name === 'home') { 
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'likeyou') { 
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'messages') { 
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'alert-circle-outline'; 
          }

          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="profile" 
        options={{ title: 'Profile' }}
      />
      <Tabs.Screen
        name="home" 
        options={{ title: 'People' }}
      />
      <Tabs.Screen
        name="likeyou" 
        options={{ title: 'Like You' }}
      />
      <Tabs.Screen 
        name="chat" 
        options={{ title: 'Chat'}} 
      />
       
    </Tabs>
  );
}