import { FC, useMemo, useState } from "react"
import { Platform, View, ViewStyle, TextStyle } from "react-native"
import { KeyboardAvoidingView } from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ChatReportHeader, ChatMessageList, ChatInputBar } from "@/components/chat"
import { Text } from "@/components/Text"
import type { AppStackScreenProps } from "@/navigators/navigationTypes"
import { type ChatMessage, useConversation } from "@/queries/useConversation"
import { useReport } from "@/queries/useReports"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

interface ReportChatScreenProps extends AppStackScreenProps<"ReportChat"> {}

export const ReportChatScreen: FC<ReportChatScreenProps> = function ReportChatScreen({ route }) {
  const { reportId } = route.params
  const { themed } = useAppTheme()
  const insets = useSafeAreaInsets()
  const { data: report } = useReport(reportId)
  const { messages, isCreating, isStreaming, streamingContent, error, sendMessage } =
    useConversation(reportId)

  const [inputText, setInputText] = useState("")

  const listData = useMemo(() => {
    const settled = [...messages].reverse()
    if (!isStreaming) return settled
    const streaming: ChatMessage & { isStreaming?: boolean } = {
      id: "__streaming__",
      role: "assistant",
      content: streamingContent,
      createdAt: "",
      isStreaming: true,
    }
    return [streaming, ...settled]
  }, [messages, isStreaming, streamingContent])

  function handleSend() {
    const text = inputText.trim()
    if (!text || isStreaming || isCreating) return
    setInputText("")
    sendMessage(text)
  }

  return (
    <KeyboardAvoidingView
      style={$fill}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={56 + insets.top}
    >
      <View style={[themed($screen), $fill]}>
        {report && (
          <ChatReportHeader
            title={report.title}
            date={report.date}
            location={report.location}
            status={report.status}
          />
        )}

        <ChatMessageList messages={listData} isCreating={isCreating} />

        {error && (
          <View style={themed($errorBanner)}>
            <Text size="xxs" style={themed($errorText)}>
              {error}
            </Text>
          </View>
        )}

        <ChatInputBar
          value={inputText}
          onChangeText={setInputText}
          onSend={handleSend}
          disabled={isStreaming || isCreating}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const $fill: ViewStyle = { flex: 1 }

const $screen: ThemedStyle<ViewStyle> = ({ colors }) => ({
  flex: 1,
  backgroundColor: colors.background,
})

const $errorBanner: ThemedStyle<ViewStyle> = ({ colors, spacing }) => ({
  backgroundColor: colors.errorBackground,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
})

const $errorText: ThemedStyle<TextStyle> = ({ colors }) => ({
  color: colors.error,
  textAlign: "center",
})
