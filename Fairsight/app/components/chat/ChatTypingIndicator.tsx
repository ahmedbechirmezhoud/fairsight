import { useEffect } from "react"
import { View, ViewStyle } from "react-native"
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

function AnimatedDot({ delay }: { delay: number }) {
  const { themed } = useAppTheme()
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(withTiming(1, { duration: 500 }), -1, true))
  }, [delay, opacity])

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return <Animated.View style={[animStyle, themed($dot)]} />
}

export function ChatTypingIndicator() {
  return (
    <View style={$row}>
      <AnimatedDot delay={0} />
      <AnimatedDot delay={180} />
      <AnimatedDot delay={360} />
    </View>
  )
}

const $row: ViewStyle = {
  flexDirection: "row",
  gap: 5,
  alignItems: "center",
  paddingVertical: 2,
  paddingHorizontal: 2,
}

const $dot: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  width: 7,
  height: 7,
  borderRadius: radius.full,
  backgroundColor: colors.textDim,
})
