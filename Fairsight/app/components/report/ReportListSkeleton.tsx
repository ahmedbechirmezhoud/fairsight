import { View, ViewStyle } from "react-native"

import { ReportCardSkeleton } from "@/components/report"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

const KEYS = ["s1", "s2", "s3", "s4"]

export function ReportListSkeleton({ contentStyle }: { contentStyle?: ViewStyle }) {
  const { themed } = useAppTheme()

  return (
    <View style={contentStyle}>
      {KEYS.map((key, i) => (
        <View key={key}>
          <ReportCardSkeleton />
          {i < KEYS.length - 1 && <View style={themed($separator)} />}
        </View>
      ))}
    </View>
  )
}

const $separator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.sm,
})
