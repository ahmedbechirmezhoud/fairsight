import { View, ViewStyle, TextStyle } from "react-native"
import Markdown from "react-native-markdown-display"

import { Text } from "@/components/Text"
import type { ChatMessage } from "@/queries/useConversation"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

import { ChatTypingIndicator } from "./ChatTypingIndicator"

export interface ChatMessageBubbleProps {
  message: ChatMessage & { isStreaming?: boolean }
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const { themed, theme } = useAppTheme()
  const isUser = message.role === "user"

  return (
    <View style={isUser ? $userRow : $assistantRow}>
      <View style={[themed($bubble), isUser ? themed($userBubble) : themed($assistantBubble)]}>
        {message.isStreaming && message.content === "" ? (
          <ChatTypingIndicator />
        ) : isUser ? (
          <Text size="sm" style={[themed($bubbleText), { color: theme.colors.textInverse }]}>
            {message.content}
          </Text>
        ) : (
          <Markdown style={buildMarkdownStyles(theme)}>
            {message.content + (message.isStreaming ? "▍" : "")}
          </Markdown>
        )}
      </View>
    </View>
  )
}

function buildMarkdownStyles(theme: ReturnType<typeof useAppTheme>["theme"]) {
  const { colors, typography } = theme
  return {
    body: { color: colors.text, fontSize: 14, lineHeight: 20 },
    strong: { fontFamily: typography.primary.semiBold },
    em: { fontStyle: "italic" as const },
    bullet_list: { marginVertical: 2 },
    ordered_list: { marginVertical: 2 },
    list_item: { marginVertical: 1 },
    paragraph: { marginVertical: 2 },
    code_inline: {
      backgroundColor: colors.separator,
      color: colors.text,
      borderRadius: 4,
      fontFamily: typography.code,
      fontSize: 13,
    },
    code_block: {
      backgroundColor: colors.separator,
      color: colors.text,
      borderRadius: 6,
      padding: 8,
      fontFamily: typography.code,
      fontSize: 13,
    },
  }
}

const $userRow: ViewStyle = { alignItems: "flex-end" }
const $assistantRow: ViewStyle = { alignItems: "flex-start" }

const $bubble: ThemedStyle<ViewStyle> = ({ radius }) => ({
  maxWidth: "80%",
  borderRadius: radius.lg,
  paddingHorizontal: 14,
  paddingVertical: 10,
})

const $userBubble: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.tint,
  borderBottomRightRadius: 4,
})

const $assistantBubble: ThemedStyle<ViewStyle> = ({ colors }) => ({
  backgroundColor: colors.backgroundSurface,
  borderBottomLeftRadius: 4,
})

const $bubbleText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.text,
  lineHeight: 20,
})
