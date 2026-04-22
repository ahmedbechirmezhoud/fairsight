import { FC, useCallback, useRef, useState } from "react"
import { FlatList, Pressable, TextStyle, View, ViewStyle } from "react-native"
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
import { TextField } from "@/components/TextField"
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
  const inputRef = useRef<React.ElementRef<typeof TextField>>(null)
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

  const bottomPad: ViewStyle = { paddingBottom: insets.bottom + 8 }

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
          bottomPad,
          // On iOS 26+ let glass provide the visual — remove the solid bg and border
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
              // Fallback solid bg when glass is not active
              !isLiquidGlassSupported && { backgroundColor: theme.colors.backgroundSurface },
            ]}
          >
            <TextField
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
              containerStyle={$fieldContainer}
              inputWrapperStyle={$fieldWrapper}
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
              hitSlop={12}
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

// Solid bar — used on older iOS and Android
const $bar: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.background,
  borderTopWidth: 1,
  borderTopColor: colors.border,
  paddingTop: spacing.sm,
  paddingHorizontal: spacing.md,
})

// Override: transparent + no border when liquid glass is active
const $barGlass: ViewStyle = {
  backgroundColor: "transparent",
  borderTopWidth: 0,
}

const $row: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
}

// Neutralize TextField's default container/wrapper so LiquidGlassView provides the visual
const $fieldContainer: ViewStyle = { padding: 0, margin: 0 }
const $fieldWrapper: ViewStyle = { borderWidth: 0, backgroundColor: "transparent", padding: 0 }

const $inputPill: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  borderRadius: 12,
  height: 40,
  paddingHorizontal: 10,
}

const $input: ThemedStyle<TextStyle> = ({ colors }) => ({
  flex: 1,
  color: colors.text,
  fontSize: 16,
  paddingVertical: 0,
})

const $closeGlass: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 20,
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
  color: colors.textDim,
  fontSize: 13,
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
