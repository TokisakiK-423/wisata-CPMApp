import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { logout } from "@/app/lib/customer/utils/auth";
import { styles, COLORS } from "@/app/lib/customer/styles";

export default function CustomerTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      {/*  BACKGROUND GLOBAL */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.background}
      />

      <Tabs
        screenOptions={{
          headerShown: true,
          headerTransparent: true,

          headerStyle: {
            height: 80 + insets.top,
          },

          headerTitleStyle: {
            color: COLORS.white,
            fontWeight: "bold",
          },

          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.gray,
          tabBarStyle: styles.tabBar,

          sceneContainerStyle: {
            backgroundColor: "transparent",
          },

          headerRight: () => (
            <TouchableOpacity onPress={logout} style={styles.headerRight}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="booking"
          options={{
            title: "Booking",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="review"
          options={{
            title: "Review",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="star-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
