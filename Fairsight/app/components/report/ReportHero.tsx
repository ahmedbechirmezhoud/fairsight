import { ImageStyle, View, ViewStyle } from "react-native"
import Animated from "react-native-reanimated"

const HERO_HEIGHT = 280

interface ReportHeroProps {
  thumbnail: string
  id: string
  title?: string
}

export function ReportHero({ thumbnail, id, title }: ReportHeroProps) {
  return (
    <View style={$wrapper}>
      <Animated.Image
        source={{ uri: thumbnail }}
        style={$image}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel={title ? `Thumbnail for ${title}` : "Report thumbnail"}
        sharedTransitionTag={`thumbnail-${id}`}
      />
    </View>
  )
}

const $wrapper: ViewStyle = { position: "relative" }

const $image: ImageStyle = { width: "100%", height: HERO_HEIGHT }
