import { TextStyle, View, ViewStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportDetail, ReportImage } from "@/types/api"

import { ContextSection } from "./ContextSection"
import { DetailsSection } from "./DetailsSection"
import { FlightSection } from "./FlightSection"
import { ImagesGallery } from "./ImagesGallery"
import { IssuesList } from "./IssuesList"
import {
  ContextSectionSkeleton,
  DetailsSectionSkeleton,
  FlightSectionSkeleton,
  ImagesSectionSkeleton,
  IssuesSectionSkeleton,
} from "./ReportDetailSkeleton"

interface ReportDetailSectionsProps {
  report: ReportDetail | undefined
  images: ReportImage[]
  loadingReport: boolean
  loadingImages: boolean
}

export function ReportDetailSections({
  report,
  images,
  loadingReport,
  loadingImages,
}: ReportDetailSectionsProps) {
  const { themed } = useAppTheme()

  return (
    <View style={themed($container)}>
      {loadingReport ? (
        <DetailsSectionSkeleton />
      ) : (
        report && (
          <DetailsSection
            description={report.description}
            client={report.client}
            inspector={report.inspector}
          />
        )
      )}

      <View style={themed($divider)} />

      {loadingReport ? (
        <ContextSectionSkeleton />
      ) : (
        report && (
          <ContextSection
            latitude={report.coordinates.latitude}
            longitude={report.coordinates.longitude}
            location={report.location}
            temperature_c={report.weather.temperature_c}
            wind_speed_kmh={report.weather.wind_speed_kmh}
            conditions={report.weather.conditions}
            area_sqm={report.area_sqm}
          />
        )
      )}

      <View style={themed($divider)} />

      {loadingReport ? (
        <FlightSectionSkeleton />
      ) : (
        report && (
          <FlightSection
            model={report.drone.model}
            flight_altitude_m={report.drone.flight_altitude_m}
            flight_duration_min={report.drone.flight_duration_min}
          />
        )
      )}

      <View style={themed($divider)} />

      {loadingImages ? (
        <ImagesSectionSkeleton />
      ) : (
        <View style={themed($gallerySection)}>
          <Text size="xxs" weight="semiBold" style={themed($sectionTitle)}>
            IMAGES
          </Text>
          <ImagesGallery images={images} />
        </View>
      )}

      <View style={themed($divider)} />

      {loadingReport ? (
        <IssuesSectionSkeleton />
      ) : (
        report && <IssuesList issues={report.issues} images={images} />
      )}
    </View>
  )
}

const $container: ThemedStyle<ViewStyle> = ({ spacing }) => ({
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
