import { TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ReportCardBodyProps {
  description?: string
  issuesCount: number
}

export function ReportCardBody({ description, issuesCount }: ReportCardBodyProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      {/* Separator */}
      <View style={themed($separator)} />

      {/* Description — only shown when available (detail fetch) */}
      {!!description && (
        <Text size="xs" style={themed($description)} numberOfLines={2}>
          {description}
        </Text>
      )}

      {/* Footer: issue count */}
      <Text size="xxs" weight="medium" style={themed($issueCount)}>
        {issuesCount} {issuesCount === 1 ? "issue" : "issues"} found
      </Text>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingBottom: spacing.md,
  paddingTop: spacing.xs,
  gap: spacing.xs,
})

const $separator: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
})

const $description: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
})

const $issueCount: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
