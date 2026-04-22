import { Platform, Pressable, ViewStyle } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialSymbol, SFSymbol } from "@react-navigation/native"

import { ReportsListScreen } from "@/screens/ReportsListScreen"
import { ReportsMapScreen } from "@/screens/ReportsMapScreen"
import { ReportsSearchScreen } from "@/screens/ReportsSearchScreen"
import { useAppTheme } from "@/theme/context"

import type { ReportsTabParamList } from "./navigationTypes"

type SFSymbolName = import("sf-symbols-typescript").SFSymbol
type MaterialSymbolName = import("@react-navigation/native").MaterialSymbolProps["name"]

const $toggleButton: ViewStyle = {
  width: 44,
  height: 44,
  alignItems: "center",
  justifyContent: "center",
}
const $symbolSize: { width: number; height: number } = { width: 18, height: 18 }

function ThemeToggleButton() {
  const {
    themeContext,
    setThemeContextOverride,
    theme: { colors },
  } = useAppTheme()
  const isDark = themeContext === "dark"

  return (
    <Pressable
      onPress={() => setThemeContextOverride(isDark ? "light" : "dark")}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={$toggleButton}
    >
      {Platform.OS === "ios" ? (
        <SFSymbol
          name={isDark ? "sun.max" : "moon"}
          color={colors.text}
          weight="regular"
          style={$symbolSize}
        />
      ) : (
        <MaterialSymbol
          name={isDark ? "light_mode" : "dark_mode"}
          color={colors.text}
          style={$symbolSize}
        />
      )}
    </Pressable>
  )
}

const Tab = createBottomTabNavigator<ReportsTabParamList>()

const listIcon = Platform.select({
  ios: { type: "sfSymbol" as const, name: "list.bullet" as SFSymbolName },
  default: { type: "materialSymbol" as const, name: "format_list_bulleted" as MaterialSymbolName },
})

const mapIcon = Platform.select({
  ios: { type: "sfSymbol" as const, name: "map" as SFSymbolName },
  default: { type: "materialSymbol" as const, name: "map" as MaterialSymbolName },
})

const searchIcon = Platform.select({
  ios: undefined, // tabBarSystemItem: 'search' provides the icon on iOS
  default: { type: "materialSymbol" as const, name: "search" as MaterialSymbolName },
})

export function ReportsTabNavigator() {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textDim,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tab.Screen
        name="ReportsList"
        component={ReportsListScreen}
        options={{
          title: "Reports",
          headerShown: true,
          headerTitle: "Reports",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerRight: () => <ThemeToggleButton />,
          tabBarLabel: "List",
          tabBarIcon: () => listIcon!,
        }}
      />
      <Tab.Screen
        name="ReportsMap"
        component={ReportsMapScreen}
        options={{
          title: "Map",
          tabBarIcon: () => mapIcon!,
        }}
      />
      <Tab.Screen
        name="ReportsSearch"
        component={ReportsSearchScreen}
        options={{
          title: "Search",
          tabBarSystemItem: Platform.OS === "ios" ? "search" : undefined,
          tabBarIcon: searchIcon ? () => searchIcon : undefined,
          // Hide the tab bar — the screen renders its own bottom search bar in its place
          tabBarStyle: { display: "none" },
        }}
      />
    </Tab.Navigator>
  )
}
