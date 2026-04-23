import { ActivityIndicator, FlatList, View, ViewStyle, TextStyle } from "react-native"

import { Text } from "@/components/Text"
import type { ChatMessage } from "@/queries/useConversation"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { ChatMessageBubble } from "./ChatMessageBubble"

interface ChatMessageListProps {
  messages: (ChatMessage & { isStreaming?: boolean })[]
  isCreating: boolean
}

export function ChatMessageList({ messages, isCreating }: ChatMessageListProps) {
  const { themed, theme } = useAppTheme()

  if (isCreating) {
    return (
      <View style={$loadingContainer}>
        <ActivityIndicator color={theme.colors.textDim} />
        <Text size="xs" style={themed($loadingText)}>
          Starting conversation…
        </Text>
      </View>
    )
  }

  return (
    <FlatList
      data={messages}
      inverted
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatMessageBubble message={item} />}
      contentContainerStyle={themed($listContent)}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View style={$emptyContainer}>
          <Text size="xs" style={themed($emptyText)}>
            Ask anything about this report.
          </Text>
        </View>
      }
    />
  )
}

const $listContent: ThemedStyle<ViewStyle> = ({ spacing }) => ({
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.sm,
  gap: spacing.xs,
  flexGrow: 1,
})

const $loadingContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
}

const $loadingText: ThemedStyle<TextStyle> = ({ colors }) => ({ color: colors.textDim })

const $emptyContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 80,
}

const $emptyText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.textSubtle,
  textAlign: "center",
})
