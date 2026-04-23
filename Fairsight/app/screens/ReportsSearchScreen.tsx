import { FC, useCallback, useRef, useState } from "react"
import {
  // eslint-disable-next-line no-restricted-imports
  TextInput,
  FlatList,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import {
  isLiquidGlassSupported,
  LiquidGlassContainerView,
  LiquidGlassView,
} from "@callstack/liquid-glass"
import { useFocusEffect } from "@react-navigation/native"
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ReportCard, ReportCardSkeleton } from "@/components/report"
import { Text } from "@/components/Text"
import type { ReportsTabScreenProps } from "@/navigators/navigationTypes"
import { useReports } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportSummary } from "@/types/api"

const SKELETON_KEYS = ["s1", "s2", "s3"]

interface ReportsSearchScreenProps extends ReportsTabScreenProps<"ReportsSearch"> {}

export const ReportsSearchScreen: FC<ReportsSearchScreenProps> = function ReportsSearchScreen({
  navigation,
}) {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()
  const inputRef = useRef<TextInput>(null)
  const [query, setQuery] = useState("")

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => {
        clearTimeout(timer)
        setQuery("")
      }
    }, []),
  )

  const { data, isLoading } = useReports(
    query.trim().length > 0 ? { search: query.trim() } : undefined,
  )
  const reports = data?.reports ?? []

  function handleClose() {
    inputRef.current?.blur()
    navigation.navigate("ReportsList")
  }

  function handlePressReport(report: ReportSummary) {
    navigation.navigate("ReportDetail", { id: report.id, thumbnail: report.thumbnail })
  }

  return (
    <View style={themed($screen)}>
      {/* Results */}
      <Animated.View entering={FadeIn.duration(200)} style={$fill}>
        {query.trim().length === 0 ? (
          <View style={[$fill, $centered]}>
            <Text size="sm" style={themed($hint)}>
              Search by title or location
            </Text>
          </View>
        ) : isLoading ? (
          <View style={themed($listContent)}>
            {SKELETON_KEYS.map((key) => (
              <View key={key} style={themed($skeletonWrap)}>
                <ReportCardSkeleton />
              </View>
            ))}
          </View>
        ) : reports.length === 0 ? (
          <View style={[$fill, $centered]}>
            <Text size="sm" style={themed($hint)}>
              {`No results for "${query}"`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => <ReportCard report={item} onPress={handlePressReport} />}
            contentContainerStyle={themed($listContent)}
            ItemSeparatorComponent={() => <View style={themed($separator)} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Animated.View>

      {/* Bottom search bar — slides up where the tab bar was */}
      <Animated.View
        entering={SlideInDown.duration(280).springify().damping(20).stiffness(200)}
        style={[
          themed($bar),
          { paddingBottom: insets.bottom + 10 },
          isLiquidGlassSupported && $barGlass,
        ]}
      >
        {/*
          LiquidGlassContainerView merges the two adjacent glass elements so their
          edges dissolve into each other — input pill + X button read as one surface.
          On older iOS / Android it falls back to two plain Views.
        */}
        <LiquidGlassContainerView spacing={8} style={$row}>
          {/* Input pill */}
          <LiquidGlassView
            effect="regular"
            style={[
              $inputPill,
              !isLiquidGlassSupported && { backgroundColor: theme.colors.backgroundSurface },
            ]}
          >
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Search reports…"
              placeholderTextColor={theme.colors.textDim}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
              style={themed($input)}
            />
          </LiquidGlassView>

          {/* X button */}
          <LiquidGlassView
            effect="regular"
            interactive
            style={[
              $closeGlass,
              !isLiquidGlassSupported && { backgroundColor: theme.colors.backgroundSurface },
            ]}
          >
            <Pressable
              onPress={handleClose}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Close search"
              style={$closePressable}
            >
              <Text style={themed($closeIcon)}>✕</Text>
            </Pressable>
          </LiquidGlassView>
        </LiquidGlassContainerView>
      </Animated.View>
    </View>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const $fill: ViewStyle = { flex: 1 }

const $centered: ViewStyle = {
  alignItems: "center",
  justifyContent: "center",
}

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $bar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopWidth: 1,
  borderTopColor: colors.border,
  paddingTop: spacing.sm,
  paddingHorizontal: spacing.md,
})

const $barGlass: ViewStyle = {
  backgroundColor: "transparent",
  borderTopWidth: 0,
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

const $inputPill: ViewStyle = {
  flex: 1,
  height: 50,
  borderRadius: 14,
  justifyContent: "center",
  overflow: "hidden",
}

const $input: ThemedStyle<TextStyle> = ({ colors, typography }) => ({
  flex: 1,
  color: colors.text,
  fontSize: 17,
  fontFamily: typography.primary.normal,
  height: 50,
  paddingHorizontal: 14,
  paddingVertical: 0,
})

const $closeGlass: ViewStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  alignItems: "center",
  justifyContent: "center",
}

const $closePressable: ViewStyle = {
  width: "100%",
  height: "100%",
  alignItems: "center",
  justifyContent: "center",
}

const $closeIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  fontSize: 17,
  fontWeight: "600",
  lineHeight: 22,
})

const $hint: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.lg,
  paddingTop: spacing.xs,
  flexGrow: 1,
})

const $separator: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  height: spacing.sm,
})

const $skeletonWrap: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  marginBottom: spacing.sm,
})
