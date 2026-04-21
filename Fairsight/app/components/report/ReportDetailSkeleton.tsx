import { View, ViewStyle } from "react-native"

import { SkeletonBlock } from "@/components/SkeletonBlock"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

// ─── Header block (badges + title + date) ───────────────────────────────────

export function ReportDetailHeaderSkeleton() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($headerBlock)}>
      <View style={$row}>
        <SkeletonBlock style={themed($pill)} />
        <SkeletonBlock style={themed($pillShort)} />
      </View>
      <SkeletonBlock style={$titleFull} />
      <SkeletonBlock style={$titleHalf} />
      <SkeletonBlock style={$dateLine} />
    </View>
  )
}

// ─── Details section ─────────────────────────────────────────────────────────

export function DetailsSectionSkeleton() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($section)}>
      <SkeletonBlock style={themed($sectionLabel)} />
      <View style={themed($card)}>
        {/* Description — 3 lines */}
        <View style={themed($rowPad)}>
          <SkeletonBlock style={themed($labelInline)} />
          <View style={themed($textStack)}>
            <SkeletonBlock style={$lineFull} />
            <SkeletonBlock style={$lineFull} />
            <SkeletonBlock style={$lineMid} />
          </View>
        </View>
        <View style={themed($divider)} />
        {/* Client */}
        <View style={themed($inlineRow)}>
          <SkeletonBlock style={themed($labelInline)} />
          <SkeletonBlock style={$lineShort} />
        </View>
        <View style={themed($divider)} />
        {/* Inspector */}
        <View style={themed($inlineRow)}>
          <SkeletonBlock style={themed($labelInline)} />
          <SkeletonBlock style={$lineShort} />
        </View>
      </View>
    </View>
  )
}

// ─── Context section ──────────────────────────────────────────────────────────

export function ContextSectionSkeleton() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($section)}>
      <SkeletonBlock style={themed($sectionLabel)} />
      {/* Map placeholder */}
      <SkeletonBlock style={themed($mapPlaceholder)} />
      {/* Weather stats row */}
      <View style={themed($statsRow)}>
        <SkeletonBlock style={themed($statBlock)} />
        <SkeletonBlock style={themed($statBlock)} />
        <SkeletonBlock style={themed($statBlock)} />
        <SkeletonBlock style={themed($statBlock)} />
      </View>
    </View>
  )
}

// ─── Flight section ───────────────────────────────────────────────────────────

export function FlightSectionSkeleton() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($section)}>
      <SkeletonBlock style={themed($sectionLabel)} />
      <View style={themed($statsRow)}>
        <SkeletonBlock style={themed($statBlock)} />
        <SkeletonBlock style={themed($statBlock)} />
        <SkeletonBlock style={themed($statBlock)} />
      </View>
    </View>
  )
}

// ─── Images section ───────────────────────────────────────────────────────────

export function ImagesSectionSkeleton() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($section)}>
      <SkeletonBlock style={themed($sectionLabel)} />
      <View style={themed($imageGrid)}>
        <SkeletonBlock style={themed($imageCell)} />
        <SkeletonBlock style={themed($imageCell)} />
        <SkeletonBlock style={themed($imageCell)} />
        <SkeletonBlock style={themed($imageCell)} />
      </View>
    </View>
  )
}

// ─── Issues section ───────────────────────────────────────────────────────────

function IssueItemSkeleton() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($issueItem)}>
      <View style={themed($severityBar)} />
      <View style={themed($issueContent)}>
        <View style={$row}>
          <SkeletonBlock style={themed($pill)} />
          <SkeletonBlock style={themed($pillShort)} />
        </View>
        <SkeletonBlock style={$lineFull} />
        <SkeletonBlock style={$lineMid} />
        <SkeletonBlock style={$lineShort} />
      </View>
    </View>
  )
}

export function IssuesSectionSkeleton() {
  const { themed } = useAppTheme()

  return (
    <View style={themed($section)}>
      <SkeletonBlock style={themed($sectionLabel)} />
      <View style={themed($issueList)}>
        <IssueItemSkeleton />
        <IssueItemSkeleton />
        <IssueItemSkeleton />
      </View>
    </View>
  )
}

// ─── Shared line widths ───────────────────────────────────────────────────────

const $lineFull: ViewStyle = { height: 13, width: "100%" }
const $lineMid: ViewStyle = { height: 13, width: "75%" }
const $lineShort: ViewStyle = { height: 13, width: "45%" }

// ─── Themed styles ────────────────────────────────────────────────────────────

const $headerBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  paddingBottom: spacing.sm,
  gap: spacing.xs,
})

const $row: ViewStyle = { flexDirection: "row", gap: 8 }

const $pill: ThemedStyle<ViewStyle> = ({ radius }) => ({
  width: 72,
  height: 20,
  borderRadius: radius.full,
})

const $pillShort: ThemedStyle<ViewStyle> = ({ radius }) => ({
  width: 56,
  height: 20,
  borderRadius: radius.full,
})

const $titleFull: ViewStyle = { height: 22, width: "90%" }
const $titleHalf: ViewStyle = { height: 22, width: "55%" }
const $dateLine: ViewStyle = { height: 13, width: 100 }

const $section: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $sectionLabel: ThemedStyle<ViewStyle> = () => ({
  height: 12,
  width: 64,
})

const $card: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.lg,
  overflow: "hidden",
})

const $rowPad: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  alignItems: "flex-start",
})

const $inlineRow: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  alignItems: "center",
  justifyContent: "space-between",
})

const $textStack: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  gap: spacing.xxs,
})

const $labelInline: ThemedStyle<ViewStyle> = () => ({
  height: 12,
  width: 72,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
})

const $mapPlaceholder: ThemedStyle<ViewStyle> = ({ radius }) => ({
  height: 180,
  width: "100%",
  borderRadius: radius.lg,
})

const $statsRow: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  flexDirection: "row",
  gap: spacing.sm,
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.lg,
  padding: spacing.sm,
})

const $statBlock: ThemedStyle<ViewStyle> = ({ radius }) => ({
  flex: 1,
  height: 56,
  borderRadius: radius.md,
})

const $imageGrid: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  gap: spacing.xs,
})

const $imageCell: ThemedStyle<ViewStyle> = ({ radius }) => ({
  width: "48.5%",
  aspectRatio: 1,
  borderRadius: radius.md,
})

const $issueList: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $issueItem: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  flexDirection: "row",
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.md,
  overflow: "hidden",
  padding: spacing.sm,
  gap: spacing.sm,
})

const $severityBar: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  width: 3,
  borderRadius: radius.full,
  backgroundColor: colors.border,
  alignSelf: "stretch",
})

const $issueContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  flex: 1,
  gap: spacing.xxs,
})
