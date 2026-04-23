import { useState } from "react"
import { Image, ImageStyle, Pressable, ScrollView, ViewStyle } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import type { ReportImage } from "@/types/api"

import { ImageViewer } from "./ImageViewer"

interface IssueImageStripProps {
  images: ReportImage[]
}

export function IssueImageStrip({ images }: IssueImageStripProps) {
  const [viewerIndex, setViewerIndex] = useState(0)
  const [viewerVisible, setViewerVisible] = useState(false)

  return (
    <>
      <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(100)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={$scroll}
          contentContainerStyle={$content}
        >
          {images.map((img, i) => (
            <Pressable
              key={img.id}
              onPress={() => {
                setViewerIndex(i)
                setViewerVisible(true)
              }}
              accessibilityRole="button"
              accessibilityLabel={`View image ${i + 1}: ${img.filename}`}
            >
              <Image source={{ uri: img.url }} style={$thumb} resizeMode="cover" />
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      <ImageViewer
        images={images}
        initialIndex={viewerIndex}
        visible={viewerVisible}
        onClose={() => setViewerVisible(false)}
      />
    </>
  )
}

const $scroll: ViewStyle = { marginTop: 8 }

const $content: ViewStyle = { gap: 6 }

const $thumb: ImageStyle = { width: 80, height: 80, borderRadius: 6 }
