import { ReactElement } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"

import { useAppTheme } from "@/theme/context"
import { $styles } from "@/theme/styles"
import type { ThemedStyle } from "@/theme/types"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "@/utils/useSafeAreaInsetsStyle"

import { IconTypes, PressableIcon } from "./Icon"
import { Text, TextProps } from "./Text"

export interface HeaderProps {
  /**
   * The layout of the title relative to the action components.
   */
  titleMode?: "center" | "flex"
  titleStyle?: StyleProp<TextStyle>
  titleContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  backgroundColor?: string
  title?: TextProps["text"]
  leftIcon?: IconTypes
  leftIconColor?: string
  leftText?: TextProps["text"]
  LeftActionComponent?: ReactElement
  onLeftPress?: TouchableOpacityProps["onPress"]
  rightIcon?: IconTypes
  rightIconColor?: string
  rightText?: TextProps["text"]
  RightActionComponent?: ReactElement
  onRightPress?: TouchableOpacityProps["onPress"]
  safeAreaEdges?: ExtendedEdge[]
}

interface HeaderActionProps {
  backgroundColor?: string
  icon?: IconTypes
  iconColor?: string
  text?: TextProps["text"]
  onPress?: TouchableOpacityProps["onPress"]
  ActionComponent?: ReactElement
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/app/components/Header/}
 */
export function Header(props: HeaderProps) {
  const {
    theme: { colors },
    themed,
  } = useAppTheme()
  const {
    backgroundColor = colors.background,
    LeftActionComponent,
    leftIcon,
    leftIconColor,
    leftText,
    onLeftPress,
    onRightPress,
    RightActionComponent,
    rightIcon,
    rightIconColor,
    rightText,
    safeAreaEdges = ["top"],
    title,
    titleMode = "center",
    titleContainerStyle: $titleContainerStyleOverride,
    style: $styleOverride,
    titleStyle: $titleStyleOverride,
    containerStyle: $containerStyleOverride,
  } = props

  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)

  return (
    <View style={[$container, $containerInsets, { backgroundColor }, $containerStyleOverride]}>
      <View style={[$styles.row, $wrapper, $styleOverride]}>
        <HeaderAction
          text={leftText}
          icon={leftIcon}
          iconColor={leftIconColor}
          onPress={onLeftPress}
          backgroundColor={backgroundColor}
          ActionComponent={LeftActionComponent}
        />

        {!!title && (
          <View
            style={[
              $titleWrapperPointerEvents,
              titleMode === "center" && themed($titleWrapperCenter),
              titleMode === "flex" && $titleWrapperFlex,
              $titleContainerStyleOverride,
            ]}
          >
            <Text weight="medium" size="md" text={title} style={[$title, $titleStyleOverride]} />
          </View>
        )}

        <HeaderAction
          text={rightText}
          icon={rightIcon}
          iconColor={rightIconColor}
          onPress={onRightPress}
          backgroundColor={backgroundColor}
          ActionComponent={RightActionComponent}
        />
      </View>
    </View>
  )
}

function HeaderAction(props: HeaderActionProps) {
  const { backgroundColor, icon, text, onPress, ActionComponent, iconColor } = props
  const { themed } = useAppTheme()

  if (ActionComponent) return ActionComponent

  if (text) {
    return (
      <TouchableOpacity
        style={themed([$actionTextContainer, { backgroundColor }])}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={0.8}
      >
        <Text weight="medium" size="md" text={text} style={themed($actionText)} />
      </TouchableOpacity>
    )
  }

  if (icon) {
    return (
      <PressableIcon
        size={24}
        icon={icon}
        color={iconColor}
        onPress={onPress}
        containerStyle={themed([$actionIconContainer, { backgroundColor }])}
      />
    )
  }

  return <View style={[$actionFillerContainer, { backgroundColor }]} />
}

const $wrapper: ViewStyle = {
  height: 56,
  alignItems: "center",
  justifyContent: "space-between",
}

const $container: ViewStyle = {
  width: "100%",
}

const $title: TextStyle = {
  textAlign: "center",
}

const $actionTextContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing.md,
  zIndex: 2,
})

const $actionText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.tint,
})

const $actionIconContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing.md,
  zIndex: 2,
})

const $actionFillerContainer: ViewStyle = {
  width: 16,
}

const $titleWrapperPointerEvents: ViewStyle = {
  pointerEvents: "none",
}

const $titleWrapperCenter: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  position: "absolute",
  paddingHorizontal: spacing.xxl,
  zIndex: 1,
})

const $titleWrapperFlex: ViewStyle = {
  justifyContent: "center",
  flexGrow: 1,
}
