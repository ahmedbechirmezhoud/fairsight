import { View, ViewStyle, TextStyle } from "react-native"
import { DotLottie } from "@lottiefiles/dotlottie-react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ReportListEmptyStateProps {
  isError: boolean
  onRetry: () => void
}

export function ReportListEmptyState({ isError, onRetry }: ReportListEmptyStateProps) {
  const { themed } = useAppTheme()

  if (isError) {
    return (
      <View style={[$centered, themed($container)]}>
        <DotLottie
          source={require("../../../assets/drone_error.lottie")}
          style={$lottie}
          autoplay
          loop
        />
        <Text size="lg" weight="semiBold" style={themed($title)}>
          Could not load reports
        </Text>
        <Text size="xs" style={themed($message)}>
          Check your connection and try again.
        </Text>
        <Text size="xs" weight="semiBold" style={themed($retryLink)} onPress={onRetry}>
          Retry
        </Text>
      </View>
    )
  }

  return (
    <View style={[$centered, themed($container)]}>
      <Text size="lg" weight="semiBold" style={themed($title)}>
        No reports yet
      </Text>
      <Text size="xs" style={themed($message)}>
        Reports will appear here once inspections are uploaded.
      </Text>
    </View>
  )
}

const $lottie: ViewStyle = { width: 300, height: 300 }

const $centered: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  minHeight: 300,
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  paddingHorizontal: spacing.xl,
})

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
})

const $message: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $retryLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  textAlign: "center",
  marginTop: spacing.xs,
})
