import { ImageStyle, View, ViewStyle } from "react-native"
import Animated from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const THUMBNAIL_HEIGHT = 200

interface ReportThumbnailProps {
  uri: string
  /** Radius applied to top corners only (card context). Pass false for square. */
  roundedTop?: boolean
  sharedTransitionTag?: string
}

export function ReportThumbnail({
  uri,
  roundedTop = true,
  sharedTransitionTag,
}: ReportThumbnailProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed(roundedTop ? $containerRounded : $container)}>
      <Animated.Image
        source={{ uri }}
        style={$image}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel="Report thumbnail"
        sharedTransitionTag={sharedTransitionTag}
      />
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors }) => ({
  width: "100%",
  height: THUMBNAIL_HEIGHT,
  backgroundColor: colors.backgroundSurface,
  overflow: "hidden",
})

const $containerRounded: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  width: "100%",
  height: THUMBNAIL_HEIGHT,
  backgroundColor: colors.backgroundSurface,
  overflow: "hidden",
  borderTopLeftRadius: radius.lg,
  borderTopRightRadius: radius.lg,
})

const $image: ImageStyle = {
  width: "100%",
  height: "100%",
}
