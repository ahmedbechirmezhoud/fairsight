import { useRef, useState, useCallback } from "react"
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  Modal,
  Platform,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
  ViewToken,
} from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"
import type { ReportImage } from "@/types/api"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const MIN_SCALE = 1
const MAX_SCALE = 4

interface ZoomableImageProps {
  image: ReportImage
  onZoomChange: (zoomed: boolean) => void
}

function ZoomableImage({ image, onZoomChange }: ZoomableImageProps) {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const savedTranslateX = useSharedValue(0)
  const savedTranslateY = useSharedValue(0)

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, savedScale.value * e.scale))
    })
    .onEnd(() => {
      if (scale.value < 1.05) {
        scale.value = withTiming(1)
        translateX.value = withTiming(0)
        translateY.value = withTiming(0)
        savedScale.value = 1
        savedTranslateX.value = 0
        savedTranslateY.value = 0
        runOnJS(onZoomChange)(false)
      } else {
        savedScale.value = scale.value
        runOnJS(onZoomChange)(true)
      }
    })

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX
      translateY.value = savedTranslateY.value + e.translationY
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value
      savedTranslateY.value = translateY.value
    })

  const composed = Gesture.Simultaneous(pinch, pan)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[$imageContainer, animatedStyle]}>
        <Image
          source={{ uri: image.url }}
          style={$zoomableImage}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel={image.filename}
        />
      </Animated.View>
    </GestureDetector>
  )
}

interface ImageViewerProps {
  images: ReportImage[]
  initialIndex: number
  visible: boolean
  onClose: () => void
}

export function ImageViewer({ images, initialIndex, visible, onClose }: ImageViewerProps) {
  const { themed } = useAppTheme()
  const insets = useSafeAreaInsets()
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isZoomed, setIsZoomed] = useState(false)
  const flatListRef = useRef<FlatList<ReportImage>>(null)

  const handleZoomChange = useCallback((zoomed: boolean) => {
    setIsZoomed(zoomed)
  }, [])

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index)
      setIsZoomed(false)
    }
  }).current

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ReportImage>) => (
      <View style={$slide}>
        <ZoomableImage image={item} onZoomChange={handleZoomChange} />
      </View>
    ),
    [handleZoomChange],
  )

  // Dynamic position styles — depend on runtime insets
  const $closeButtonDynamic: ViewStyle = { top: insets.top + 8 }
  const $counterDynamic: ViewStyle = { top: insets.top + 8 }
  const $typeLabelDynamic: ViewStyle = { bottom: insets.bottom + 16 }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={themed($overlay)}>
        {/* Close button */}
        <Pressable
          style={[themed($closeButton), $closeButtonDynamic]}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close image viewer"
          hitSlop={16}
        >
          <Text size="sm" weight="semiBold" style={themed($closeIcon)}>
            ✕
          </Text>
        </Pressable>

        {/* Counter */}
        <View style={[themed($counter), $counterDynamic]}>
          <Text size="xxs" weight="medium" style={themed($counterText)}>
            {currentIndex + 1} / {images.length}
          </Text>
        </View>

        {/* Image list */}
        <FlatList
          ref={flatListRef}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={!isZoomed}
          initialScrollIndex={initialIndex}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={Platform.OS === "android"}
        />

        {/* Image type + filename label */}
        {images[currentIndex] && (
          <View style={[themed($typeLabel), $typeLabelDynamic]}>
            <Text size="xxs" style={themed($typeLabelText)}>
              {images[currentIndex].type.toUpperCase()} · {images[currentIndex].filename}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  )
}

const $overlay: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: colors.palette.neutral900,
})

const $slide: ViewStyle = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  justifyContent: "center",
  alignItems: "center",
}

const $imageContainer: ViewStyle = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  justifyContent: "center",
  alignItems: "center",
}

const $zoomableImage = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT * 0.75,
}

const $closeButton: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  position: "absolute",
  right: 16,
  zIndex: 10,
  borderRadius: radius.full,
  width: 36,
  height: 36,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.palette.overlay50,
})

const $closeIcon: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $counter: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  position: "absolute",
  zIndex: 10,
  alignSelf: "center",
  borderRadius: radius.full,
  paddingHorizontal: 12,
  paddingVertical: 4,
  backgroundColor: colors.palette.overlay50,
})

const $counterText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral100,
})

const $typeLabel: ThemedStyle<ViewStyle> = ({ colors, radius }) => ({
  position: "absolute",
  zIndex: 10,
  alignSelf: "center",
  borderRadius: radius.xs,
  paddingHorizontal: 10,
  paddingVertical: 4,
  backgroundColor: colors.palette.overlay50,
})

const $typeLabelText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.palette.neutral400,
  letterSpacing: 0.5,
})
