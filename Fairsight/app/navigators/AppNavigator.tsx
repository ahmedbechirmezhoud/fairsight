import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import Config from "@/config"
import { ErrorBoundary } from "@/screens/ErrorScreen/ErrorBoundary"
import { MapReportSheetScreen } from "@/screens/MapReportSheetScreen"
import { ReportChatScreen } from "@/screens/ReportChatScreen"
import { ReportDetailScreen } from "@/screens/ReportDetailScreen"
import { WelcomeScreen } from "@/screens/WelcomeScreen"
import { useAppTheme } from "@/theme/context"

import type { AppStackParamList, NavigationProps } from "./navigationTypes"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { ReportsTabNavigator } from "./ReportsTabNavigator"

const exitRoutes = Config.exitRoutes

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 2,
    },
  },
})

const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = () => {
  const {
    theme: { colors },
  } = useAppTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="ReportsTabs" component={ReportsTabNavigator} />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "systemUltraThinMaterial",
          headerTitle: "",
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
          headerLargeTitleEnabled: false,
          headerBackTitle: "",
        }}
      />
      <Stack.Screen
        name="ReportChat"
        component={ReportChatScreen}
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: false,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="MapReportSheet"
        component={MapReportSheetScreen}
        options={{
          presentation: "formSheet",
          sheetGrabberVisible: true,
          sheetCornerRadius: 16,
          sheetAllowedDetents: [0.5, 1.0],
          sheetLargestUndimmedDetentIndex: "none",
          headerShown: false,
        }}
      />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  )
}

export const AppNavigator = (props: NavigationProps) => {
  const { navigationTheme } = useAppTheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer ref={navigationRef} theme={navigationTheme} {...props}>
        <ErrorBoundary catchErrors={Config.catchErrors}>
          <AppStack />
        </ErrorBoundary>
      </NavigationContainer>
    </QueryClientProvider>
  )
}
