import { ComponentProps } from "react"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  CompositeScreenProps,
  NavigationContainer,
  NavigatorScreenParams,
} from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

// Reports Tab Navigator types
export type ReportsTabParamList = {
  ReportsList: undefined
  ReportsMap: undefined
  ReportsSearch: undefined
}

// App Stack Navigator types
export type AppStackParamList = {
  ReportsTabs: NavigatorScreenParams<ReportsTabParamList>
  ReportDetail: { id: string; title: string; thumbnail: string }
  ReportChat: { reportId: string; reportTitle: string }
  MapReportSheet: { reportIds: string[] }
  // 🔥 Your screens go here
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

export type ReportsTabScreenProps<T extends keyof ReportsTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ReportsTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

export interface NavigationProps extends Partial<
  ComponentProps<typeof NavigationContainer<AppStackParamList>>
> {}

/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
/* eslint-enable @typescript-eslint/no-namespace */
