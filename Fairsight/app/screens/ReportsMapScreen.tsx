import { FC } from "react"
import { ActivityIndicator, TextStyle, View, ViewStyle } from "react-native"

import { ReportsMapView } from "@/components/report/ReportsMapView"
import { Text } from "@/components/Text"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ReportsMapScreenProps extends ReportsTabScreenProps<"ReportsMap"> {}

export const ReportsMapScreen: FC<ReportsMapScreenProps> = function ReportsMapScreen() {
  const { themed, theme } = useAppTheme()
  const { data, isLoading, isError, refetch } = useReports()
  const reports = data?.reports ?? []

  if (isLoading) {
    return (
      <View style={[$fill, $centered]}>
        <ActivityIndicator size="large" color={theme.colors.textDim} />
      </View>
    )
  }

  if (isError) {
    return (
      <View style={[$fill, $centered, themed($errorPad)]}>
        <Text size="sm" weight="semiBold" style={themed($errorTitle)}>
          Could not load map
        </Text>
        <Text size="xs" style={themed($errorMessage)}>
          Check your connection and try again.
        </Text>
        <Text size="xs" weight="semiBold" style={themed($retryLink)} onPress={() => refetch()}>
          Retry
        </Text>
      </View>
    )
  }

  return (
    <View style={$fill}>
      <ReportsMapView reports={reports} />
    </View>
  )
}

const $fill: ViewStyle = { flex: 1 }

const $centered: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $errorPad: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  paddingHorizontal: spacing.xl,
})

const $errorTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
})

const $errorMessage: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $retryLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  textAlign: "center",
  marginTop: spacing.xs,
})
