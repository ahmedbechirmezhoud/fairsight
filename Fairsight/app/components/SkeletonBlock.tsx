import { useEffect } from "react"
import { ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const DURATION = 900

interface SkeletonBlockProps {
  style?: object | object[]
}

export function SkeletonBlock({ style }: SkeletonBlockProps) {
  const { themed } = useAppTheme()
  const opacity = useSharedValue(1)

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.35, { duration: DURATION }), withTiming(1, { duration: DURATION })),
      -1,
      false,
    )
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return <Animated.View style={[themed($base), style, animatedStyle]} />
}

const $base: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  backgroundColor: colors.border,
  borderRadius: radius.xs,
})
