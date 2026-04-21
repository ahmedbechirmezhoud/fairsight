import { Image, ImageStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const THUMBNAIL_HEIGHT = 200

interface ReportThumbnailProps {
  uri: string
  /** Radius applied to top corners only (card context). Pass false for square. */
  roundedTop?: boolean
}

export function ReportThumbnail({ uri, roundedTop = true }: ReportThumbnailProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed(roundedTop ? $containerRounded : $container)}>
      <Image
        source={{ uri }}
        style={$image}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel="Report thumbnail"
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
