import { View, ViewStyle } from "react-native"
import Animated from "react-native-reanimated"

import { SkeletonBlock } from "@/components/SkeletonBlock"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const THUMBNAIL_HEIGHT = 200

export function ReportCardSkeleton() {
  const { themed } = useAppTheme()

  return (
    <Animated.View style={themed($card)}>
      {/* Thumbnail */}
      <SkeletonBlock style={themed($thumbnail)} />

      {/* Header block */}
      <View style={themed($headerBlock)}>
        {/* Badge row */}
        <View style={$badgeRow}>
          <SkeletonBlock style={themed($badgeShort)} />
          <SkeletonBlock style={themed($badgeLong)} />
        </View>

        {/* Title */}
        <SkeletonBlock style={$titleLine} />
        <SkeletonBlock style={$titleLineShort} />

        {/* Date */}
        <SkeletonBlock style={$dateLine} />
      </View>

      {/* Body */}
      <View style={themed($bodyBlock)}>
        <SkeletonBlock style={$bodyLine} />
      </View>
    </Animated.View>
  )
}

const $card: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.lg,
  marginHorizontal: spacing.md,
  overflow: "hidden",
  shadowColor: colors.text,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.04,
  shadowRadius: 2,
  elevation: 1,
})

const $thumbnail: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  width: "100%",
  height: THUMBNAIL_HEIGHT,
  backgroundColor: colors.border,
  borderRadius: 0,
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
})

const $headerBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingTop: spacing.sm,
  paddingBottom: spacing.xs,
  gap: spacing.xs,
})

const $badgeRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
}

const $badgeShort: ThemedStyle<ViewStyle> = ({ radius }) => ({
  width: 72,
  height: 20,
  borderRadius: radius.full,
})

const $badgeLong: ThemedStyle<ViewStyle> = ({ radius }) => ({
  width: 56,
  height: 20,
  borderRadius: radius.full,
})

const $titleLine: ViewStyle = { width: "90%", height: 18 }
const $titleLineShort: ViewStyle = { width: "60%", height: 18 }
const $dateLine: ViewStyle = { width: 100, height: 13 }

const $bodyBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.sm,
  paddingBottom: spacing.sm,
})

const $bodyLine: ViewStyle = { width: 80, height: 13 }
