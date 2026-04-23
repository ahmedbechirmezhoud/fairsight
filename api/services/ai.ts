import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { StreamChatParams } from "../types"

export function streamChat({ systemPrompt, history, userContent, abortSignal }: StreamChatParams) {
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userContent },
  ]

  return streamText({
    model: openai("gpt-4o-mini"),
    messages,
    maxOutputTokens: 1024,
    abortSignal,
  })
}
