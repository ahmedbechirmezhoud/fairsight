import { View, ViewStyle, TextStyle } from "react-native"

import { SectionHeader } from "@/components/SectionHeader"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { Issue, ReportImage } from "@/types/api"

import { IssueListItem } from "./IssueListItem"

interface IssuesListProps {
  issues: Issue[]
  images: ReportImage[]
}

export function IssuesList({ issues, images }: IssuesListProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <SectionHeader title="Issues" count={issues.length} />

      {issues.length === 0 ? (
        <View style={themed($empty)}>
          <Text size="xs" style={themed($emptyText)}>
            No issues identified
          </Text>
        </View>
      ) : (
        <View style={$list}>
          {issues.map((issue) => (
            <IssueListItem
              key={issue.id}
              issue={issue}
              relatedImages={images.filter((img) => img.issue_refs.includes(issue.id))}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $list: ViewStyle = {
  gap: 8,
}

const $empty: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.md,
  padding: spacing.md,
  alignItems: "center",
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
