import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { logout } from './utils/auth';
import { styles } from './styles';
import { COLORS } from './colors';

export default function AdminTabsLayout() {
  return (
    <View style={{ flex: 1 }}>

      {/* 🔥 BACKGROUND GRADASI GLOBAL */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.background}
      />

      <Tabs
        screenOptions={{
          headerShown: true,

          // 🔥 HEADER NYATU DENGAN BACKGROUND
          headerTransparent: true,
          headerTitleStyle: {
            color: COLORS.white,
            fontWeight: 'bold',
          },

          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: styles.tabBar,

          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.headerRight}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="wisata"
          options={{
            title: 'Wisata',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="booking"
          options={{
            title: 'Booking',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="review"
          options={{
            title: 'Review',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
