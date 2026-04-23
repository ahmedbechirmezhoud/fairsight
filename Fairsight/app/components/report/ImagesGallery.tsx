import { useState } from "react"
import { Dimensions, FlatList, Image, Pressable, View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportImage } from "@/types/api"
import { imageUrl } from "@/utils/imageUrl"

import { ImageViewer } from "./ImageViewer"

const { width: SCREEN_WIDTH } = Dimensions.get("window")
const COLUMNS = 2
const GAP = 8
const TILE_SIZE = (SCREEN_WIDTH - 32 - GAP) / COLUMNS // 32 = horizontal padding

interface ImagesGalleryProps {
  images: ReportImage[]
}

export function ImagesGallery({ images }: ImagesGalleryProps) {
  const { themed } = useAppTheme()
  const [viewerVisible, setViewerVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (images.length === 0) {
    return (
      <View style={themed($empty)}>
        <Text size="xs" style={themed($emptyText)}>
          No images available
        </Text>
      </View>
    )
  }

  function openViewer(index: number) {
    setSelectedIndex(index)
    setViewerVisible(true)
  }

  return (
    <>
      <FlatList
        data={images}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={$columnWrapper}
        scrollEnabled={false}
        accessibilityRole="list"
        accessibilityLabel={`${images.length} photo${images.length !== 1 ? "s" : ""}`}
        renderItem={({ item, index }) => (
          <Pressable
            style={[$tile, { width: TILE_SIZE, height: TILE_SIZE }]}
            onPress={() => openViewer(index)}
            accessibilityRole="button"
            accessibilityLabel={`Photo ${index + 1} of ${images.length}: ${item.filename}${item.issue_refs.length > 0 ? `, ${item.issue_refs.length} issue reference${item.issue_refs.length !== 1 ? "s" : ""}` : ""}`}
          >
            <Image
              source={{ uri: imageUrl(item.filename) }}
              style={$tileImage}
              resizeMode="cover"
            />
            {item.issue_refs.length > 0 && (
              <View style={themed($issueIndicator)}>
                <Text size="xxs" weight="semiBold" style={themed($issueIndicatorText)}>
                  {item.issue_refs.length}
                </Text>
              </View>
            )}
            <View style={themed($typeTag)}>
              <Text size="xxs" style={themed($typeTagText)}>
                {item.type}
              </Text>
            </View>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={{ height: GAP }} />}
      />

      <ImageViewer
        images={images}
        initialIndex={selectedIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </>
  )
}

const $columnWrapper: ViewStyle = {
  gap: GAP,
}

const $tile: ViewStyle = {
  borderRadius: 8,
  overflow: "hidden",
  position: "relative",
}

const $tileImage = {
  width: "100%" as const,
  height: "100%" as const,
}

const $issueIndicator: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  position: "absolute",
  top: 6,
  right: 6,
  backgroundColor: colors.error,
  borderRadius: radius.full,
  width: 18,
  height: 18,
  alignItems: "center",
  justifyContent: "center",
})

const $issueIndicatorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $typeTag: ThemedStyle<ViewStyle> = ({ radius }) => ({
  position: "absolute",
  bottom: 6,
  left: 6,
  backgroundColor: "rgba(15,13,12,0.55)",
  borderRadius: radius.xs,
  paddingHorizontal: 5,
  paddingVertical: 2,
})

const $typeTagText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
  textTransform: "uppercase",
  letterSpacing: 0.4,
})

const $empty: ThemedStyle<ViewStyle> = ({ colors, radius, spacing }) => ({
  backgroundColor: colors.backgroundSurface,
  borderRadius: radius.md,
  padding: spacing.lg,
  alignItems: "center",
})

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
})
