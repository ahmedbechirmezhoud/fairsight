import { useState } from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { Icon } from "@/components/Icon"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { Issue, ReportImage } from "@/types/api"

import { CATEGORY_LABEL, SEVERITY_LABEL } from "./issueConstants"
import { IssueImageStrip } from "./IssueImageStrip"
import { IssueSeverityBadge } from "./IssueSeverityBadge"
import { IssueSeverityBar } from "./IssueSeverityBar"

interface IssueListItemProps {
  issue: Issue
  relatedImages: ReportImage[]
}

export function IssueListItem({ issue, relatedImages }: IssueListItemProps) {
  const { themed, theme } = useAppTheme()
  const [expanded, setExpanded] = useState(false)
  const hasImages = relatedImages.length > 0
  const rotation = useSharedValue(0)

  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }))

  function toggle() {
    if (!hasImages) return
    const next = !expanded
    setExpanded(next)
    rotation.value = withTiming(next ? 90 : 0, { duration: 200 })
  }

  return (
    <Pressable
      onPress={toggle}
      style={themed($container)}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={`${SEVERITY_LABEL[issue.severity]} issue: ${issue.description}`}
      accessibilityHint={hasImages ? "Double tap to toggle related photos" : undefined}
    >
      <IssueSeverityBar severity={issue.severity} />

      <View style={$content}>
        <View style={$metaRow}>
          <IssueSeverityBadge severity={issue.severity} />
          <Text size="xxs" style={themed($category)}>
            {CATEGORY_LABEL[issue.category]}
          </Text>
          {hasImages && (
            <Animated.View style={[$caretWrap, caretStyle]}>
              <Icon icon="caretRight" size={12} color={theme.colors.textSubtle} />
            </Animated.View>
          )}
        </View>

        <Text size="xs" style={themed($description)}>
          {issue.description}
        </Text>

        <Text size="xxs" style={themed($location)}>
          {issue.location_on_site}
        </Text>

        {expanded && <IssueImageStrip images={relatedImages} />}
      </View>
    </Pressable>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  flexDirection: "row",
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.md,
  padding: spacing.sm,
  overflow: "hidden",
})

const $content: ViewStyle = { flex: 1, gap: 4 }

const $metaRow: ViewStyle = { flexDirection: "row", alignItems: "center", gap: 8 }

const $caretWrap: ViewStyle = { marginLeft: "auto" }

const $category: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textSubtle })

const $description: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.text })

const $location: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  fontStyle: "italic",
})
