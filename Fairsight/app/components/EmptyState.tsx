import { Image, ImageProps, ImageStyle, StyleProp, TextStyle, View, ViewStyle } from "react-native"

import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { Button, ButtonProps } from "./Button"
import { Text, TextProps } from "./Text"

const sadFace = require("@assets/images/sad-face.png")

interface EmptyStateProps {
  /**
   * An optional prop that specifies the text/image set to use for the empty state.
   */
  preset?: "generic"
  style?: StyleProp<ViewStyle>
  imageSource?: ImageProps["source"]
  imageStyle?: StyleProp<ImageStyle>
  ImageProps?: Omit<ImageProps, "source">
  heading?: TextProps["text"]
  headingStyle?: StyleProp<TextStyle>
  HeadingTextProps?: TextProps
  content?: TextProps["text"]
  contentStyle?: StyleProp<TextStyle>
  ContentTextProps?: TextProps
  button?: TextProps["text"]
  buttonStyle?: ButtonProps["style"]
  buttonTextStyle?: ButtonProps["textStyle"]
  buttonOnPress?: ButtonProps["onPress"]
  ButtonProps?: ButtonProps
}

interface EmptyStatePresetItem {
  imageSource: ImageProps["source"]
  heading: TextProps["text"]
  content: TextProps["text"]
  button: TextProps["text"]
}

const EmptyStatePresets: Record<"generic", EmptyStatePresetItem> = {
  generic: {
    imageSource: sadFace,
    heading: "Nothing here",
    content: "No data found.",
    button: "Try again",
  },
}

/**
 * A component to use when there is no data to display.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/EmptyState/}
 */
export function EmptyState(props: EmptyStateProps) {
  const {
    theme,
    themed,
    theme: { spacing },
  } = useAppTheme()

  const preset = EmptyStatePresets[props.preset ?? "generic"]

  const {
    button = preset.button,
    buttonOnPress,
    content = preset.content,
    heading = preset.heading,
    imageSource = preset.imageSource,
    style: $containerStyleOverride,
    buttonStyle: $buttonStyleOverride,
    buttonTextStyle: $buttonTextStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    imageStyle: $imageStyleOverride,
    ButtonProps,
    ContentTextProps,
    HeadingTextProps,
    ImageProps,
  } = props

  const isImagePresent = !!imageSource
  const isHeadingPresent = !!heading
  const isContentPresent = !!content
  const isButtonPresent = !!button

  const $containerStyles = [$containerStyleOverride]
  const $imageStyles = [
    $image,
    (isHeadingPresent || isContentPresent || isButtonPresent) && { marginBottom: spacing.xxxs },
    $imageStyleOverride,
    ImageProps?.style,
  ]
  const $headingStyles = [
    themed($headingStyle),
    isImagePresent && { marginTop: spacing.xxxs },
    (isContentPresent || isButtonPresent) && { marginBottom: spacing.xxxs },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const $contentStyles = [
    themed($contentStyle),
    (isImagePresent || isHeadingPresent) && { marginTop: spacing.xxxs },
    isButtonPresent && { marginBottom: spacing.xxxs },
    $contentStyleOverride,
    ContentTextProps?.style,
  ]
  const $buttonStyles = [
    (isImagePresent || isHeadingPresent || isContentPresent) && { marginTop: spacing.xl },
    $buttonStyleOverride,
    ButtonProps?.style,
  ]

  return (
    <View style={$containerStyles}>
      {isImagePresent && (
        <Image
          source={imageSource}
          {...ImageProps}
          style={$imageStyles}
          tintColor={theme.colors.palette.neutral900}
        />
      )}

      {isHeadingPresent && (
        <Text preset="subheading" text={heading} {...HeadingTextProps} style={$headingStyles} />
      )}

      {isContentPresent && <Text text={content} {...ContentTextProps} style={$contentStyles} />}

      {isButtonPresent && (
        <Button
          onPress={buttonOnPress}
          text={button}
          textStyle={$buttonTextStyleOverride}
          {...ButtonProps}
          style={$buttonStyles}
        />
      )}
    </View>
  )
}

const $image: ImageStyle = { alignSelf: "center" }
const $headingStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  paddingHorizontal: spacing.lg,
})
const $contentStyle: ThemedStyle<TextStyle> = ({ spacing }) => ({
  textAlign: "center",
  paddingHorizontal: spacing.lg,
})
