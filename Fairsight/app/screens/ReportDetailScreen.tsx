import { FC } from "react"
import { ActivityIndicator, Image, Pressable, TextStyle, View, ViewStyle } from "react-native"

import { ContextSection } from "@/components/report/ContextSection"
import { DetailsSection } from "@/components/report/DetailsSection"
import { FlightSection } from "@/components/report/FlightSection"
import { ImagesGallery } from "@/components/report/ImagesGallery"
import { IssuesList } from "@/components/report/IssuesList"
import { StatusBadge } from "@/components/report/StatusBadge"
import { TypeBadge } from "@/components/report/TypeBadge"
import { Screen } from "@/components/Screen"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { useReport, useReportImages } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import { formatReportDate } from "@/utils/reportFormatters"

const HERO_HEIGHT = 280

interface ReportDetailScreenProps extends AppStackScreenProps<"ReportDetail"> {}

export const ReportDetailScreen: FC<ReportDetailScreenProps> = function ReportDetailScreen({
  navigation,
  route,
}) {
  const { id } = route.params
  const {
    themed,
    theme: {
      colors: { text: textColor, textSubtle },
    },
  } = useAppTheme()

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
    refetch: refetchReport,
  } = useReport(id)

  const { data: imagesData, isLoading: imagesLoading } = useReportImages(id)
  const images = imagesData?.images ?? []

  // — Loading state —
  if (reportLoading) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screen)}>
        <View style={$centered}>
          <ActivityIndicator size="large" color={textColor} />
        </View>
      </Screen>
    )
  }

  // — Error state —
  if (reportError || !report) {
    return (
      <Screen preset="fixed" safeAreaEdges={["top"]} style={themed($screen)}>
        <View style={[$centered, themed($stateContainer)]}>
          <Text size="lg" weight="semiBold" style={themed($stateTitle)}>
            Could not load report
          </Text>
          <Text size="xs" style={themed($stateMessage)}>
            Check your connection and try again.
          </Text>
          <Text
            size="xs"
            weight="semiBold"
            style={themed($retryLink)}
            onPress={() => refetchReport()}
          >
            Retry
          </Text>
        </View>
      </Screen>
    )
  }

  return (
    <Screen
      preset="scroll"
      safeAreaEdges={["bottom"]}
      contentContainerStyle={themed($scrollContent)}
      style={themed($screen)}
    >
      {/* — Hero — */}
      <View style={$heroWrapper}>
        <Image
          source={{ uri: report.thumbnail }}
          style={[$hero, { height: HERO_HEIGHT }]}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={`Thumbnail for ${report.title}`}
        />
        {/* Back button overlay */}
        <Pressable
          style={themed($backButton)}
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={12}
        >
          <Text style={themed($backIcon)}>‹</Text>
        </Pressable>
      </View>

      {/* — Header block — */}
      <View style={themed($headerBlock)}>
        <View style={$badgeRow}>
          <StatusBadge status={report.status} />
          <TypeBadge type={report.inspection_type} />
        </View>
        <Text size="xl" weight="bold" style={themed($title)}>
          {report.title}
        </Text>
        <Text size="xs" style={themed($date)}>
          {formatReportDate(report.date)}
        </Text>
      </View>

      {/* — Content sections — */}
      <View style={themed($sections)}>
        <DetailsSection
          description={report.description}
          client={report.client}
          inspector={report.inspector}
        />

        <View style={themed($divider)} />

        <ContextSection
          latitude={report.coordinates.latitude}
          longitude={report.coordinates.longitude}
          location={report.location}
          temperature_c={report.weather.temperature_c}
          wind_speed_kmh={report.weather.wind_speed_kmh}
          conditions={report.weather.conditions}
          area_sqm={report.area_sqm}
        />

        <View style={themed($divider)} />

        <FlightSection
          model={report.drone.model}
          flight_altitude_m={report.drone.flight_altitude_m}
          flight_duration_min={report.drone.flight_duration_min}
        />

        <View style={themed($divider)} />

        {/* Images section — independent loading state */}
        <View style={themed($gallerySection)}>
          <Text size="xxs" weight="semiBold" style={themed($sectionTitle)}>
            IMAGES
          </Text>
          {imagesLoading ? (
            <ActivityIndicator size="small" color={textSubtle} />
          ) : (
            <ImagesGallery images={images} />
          )}
        </View>

        <View style={themed($divider)} />

        <IssuesList issues={report.issues} />
      </View>
    </Screen>
  )
}

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.background,
  flex: 1,
})

const $scrollContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingBottom: spacing.xxl,
})

const $heroWrapper: ViewStyle = {
  position: "relative",
}

const $hero = {
  width: "100%" as const,
}

const $backButton: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  position: "absolute",
  top: 48,
  left: 16,
  borderRadius: radius.full,
  width: 36,
  height: 36,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.overlay50,
})

const $backIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  fontSize: 26,
  fontWeight: "300",
  lineHeight: 30,
  marginTop: -2,
  color: colors.palette.neutral100,
})

const $headerBlock: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingTop: spacing.md,
  paddingBottom: spacing.sm,
  gap: spacing.xs,
})

const $badgeRow: ViewStyle = {
  flexDirection: "row",
  gap: 8,
  flexWrap: "wrap",
}

const $title: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
})

const $date: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})

const $sections: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  gap: spacing.xl,
})

const $divider: ThemedStyle<ViewStyle> = ({ colors }) => ({
  height: 1,
  backgroundColor: colors.separator,
})

const $gallerySection: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.sm,
})

const $sectionTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  letterSpacing: 0.8,
})

const $centered: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
}

const $stateContainer: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  gap: spacing.xs,
  paddingHorizontal: spacing.xl,
})

const $stateTitle: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  textAlign: "center",
})

const $stateMessage: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textDim,
  textAlign: "center",
})

const $retryLink: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  textAlign: "center",
  marginTop: spacing.xs,
})
