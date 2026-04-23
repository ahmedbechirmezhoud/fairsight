import { useRef } from "react"
import { Platform, Pressable, View, ViewStyle, TextStyle } from "react-native"
import { SFSymbol, MaterialSymbol } from "@react-navigation/native"
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller"
import Animated, { interpolate, useAnimatedStyle, useDerivedValue } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { TextField } from "@/components/TextField"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const MAX_CHARS = 256

interface ChatInputBarProps {
  value: string
  onChangeText: (text: string) => void
  onSend: () => void
  disabled: boolean
}

export function ChatInputBar({ value, onChangeText, onSend, disabled }: ChatInputBarProps) {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()
  const { progress } = useReanimatedKeyboardAnimation()
  const inputRef = useRef<React.ElementRef<typeof TextField>>(null)

  const bottomPad = useDerivedValue(() =>
    interpolate(progress.value, [0, 1], [insets.bottom + 8, 8]),
  )
  const $animatedPad = useAnimatedStyle(() => ({ paddingBottom: bottomPad.value }))

  const overLimit = value.length > MAX_CHARS
  const canSend = value.trim().length > 0 && !disabled && !overLimit

  return (
    <Animated.View style={[themed($bar), $animatedPad]}>
      <View style={$row}>
        <TextField
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder="Ask about this report…"
          placeholderTextColor={theme.colors.textSubtle}
          multiline
          editable={!disabled}
          blurOnSubmit={false}
          scrollEnabled
          containerStyle={$fieldContainer}
          inputWrapperStyle={[themed($fieldWrapper), overLimit && themed($fieldWrapperError)]}
          style={themed($fieldInput)}
          accessibilityLabel="Message"
          accessibilityHint="Type your question about this report"
        />
        <Pressable
          onPress={onSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !canSend }}
          style={[themed($sendButton), !canSend && themed($sendButtonDisabled)]}
        >
          {Platform.OS === "ios" ? (
            <SFSymbol
              name="arrow.up"
              color={canSend ? theme.colors.textInverse : theme.colors.textSubtle}
              weight="semibold"
              style={$iconSize}
            />
          ) : (
            <MaterialSymbol
              name="arrow_upward"
              color={canSend ? theme.colors.textInverse : theme.colors.textSubtle}
              style={$iconSize}
            />
          )}
        </Pressable>
      </View>

      {overLimit && (
        <Text
          size="xxs"
          style={themed($errorLabel)}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`Message too long: ${value.length} of ${MAX_CHARS} characters`}
        >
          {value.length}/{MAX_CHARS} — message too long
        </Text>
      )}
    </Animated.View>
  )
}

const $bar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopWidth: 1,
  borderTopColor: colors.separator,
  paddingHorizontal: spacing.sm,
  paddingTop: spacing.sm,
  gap: 4,
})

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "flex-end",
  gap: 8,
}

const $fieldContainer: ViewStyle = { flex: 1, padding: 0, margin: 0 }

const $fieldWrapper: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.md,
  backgroundColor: colors.backgroundSurface,
  paddingHorizontal: 12,
  paddingVertical: Platform.OS === "ios" ? 10 : 6,
  minHeight: 40,
  maxHeight: 120,
})

const $fieldWrapperError: ThemedStyle<ViewStyle> = ({ colors }) => ({
  borderColor: colors.error,
})

const $fieldInput: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 15,
  lineHeight: 20,
  paddingVertical: 0,
})

const $sendButton: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  width: 36,
  height: 36,
  borderRadius: radius.full,
  backgroundColor: colors.tint,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 2,
})

const $sendButtonDisabled: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.backgroundSurface,
})

const $errorLabel: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  paddingHorizontal: 4,
})

const $iconSize = { width: 16, height: 16 }
