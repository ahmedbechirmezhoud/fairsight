import { View, ViewStyle } from "react-native"

import { DetailRow } from "@/components/DetailRow"
import { SectionHeader } from "@/components/SectionHeader"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface DetailsSectionProps {
  description: string
  client: string
  inspector: string
}

export function DetailsSection({ description, client, inspector }: DetailsSectionProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      <SectionHeader title="Details" />
      <View style={themed($rows)}>
        <DetailRow label="Description" value={description} multiline />
        <View style={themed($divider)} />
        <DetailRow label="Client" value={client} />
        <View style={themed($divider)} />
        <DetailRow label="Inspector" value={inspector} />
      </View>
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $rows: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.lg,
  paddingHorizontal: spacing.md,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
})
