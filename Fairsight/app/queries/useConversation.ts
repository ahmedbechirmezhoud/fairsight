import { useCallback, useEffect, useRef, useState } from "react"

import Config from "@/config"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}

// ─── API ──────────────────────────────────────────────────────────────────────

async function apiCreateConversation(reportId: string): Promise<string> {
  const res = await fetch(`${Config.API_URL}/api/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reportId }),
  })
  if (!res.ok) throw new Error("Failed to create conversation")
  const { conversationId } = await res.json()
  return conversationId as string
}

function apiMessageUrl(conversationId: string): string {
  return `${Config.API_URL}/api/conversations/${conversationId}/messages`
}

// ─── SSE ──────────────────────────────────────────────────────────────────────

function parseSseTokens(lines: string[]): string[] {
  const tokens: string[] = []
  for (const line of lines) {
    if (!line.startsWith("data: ")) continue
    try {
      const data = JSON.parse(line.slice(6)) as { type: string; content?: string }
      if (data.type === "token" && data.content) tokens.push(data.content)
    } catch {
      // ignore malformed lines
    }
  }
  return tokens
}

// ─── State ────────────────────────────────────────────────────────────────────

interface ConversationState {
  conversationId: string | null
  messages: ChatMessage[]
  isCreating: boolean
  isStreaming: boolean
  streamingContent: string
  error: string | null
}

const INITIAL_STATE: ConversationState = {
  conversationId: null,
  messages: [],
  isCreating: true,
  isStreaming: false,
  streamingContent: "",
  error: null,
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useConversation(reportId: string) {
  const [state, setState] = useState<ConversationState>(INITIAL_STATE)

  // Refs for sync reads inside callbacks — avoids stale closures in sendMessage
  const conversationIdRef = useRef<string | null>(null)
  const isStreamingRef = useRef(false)
  const xhrRef = useRef<XMLHttpRequest | null>(null)

  // Legitimate external sync: initialize conversation once per reportId
  useEffect(() => {
    let cancelled = false

    apiCreateConversation(reportId)
      .then((id) => {
        if (cancelled) return
        conversationIdRef.current = id
        setState((prev) => ({ ...prev, conversationId: id, isCreating: false }))
      })
      .catch(() => {
        if (cancelled) return
        setState((prev) => ({
          ...prev,
          isCreating: false,
          error: "Could not start conversation. Check your connection.",
        }))
      })

    return () => {
      cancelled = true
    }
  }, [reportId])

  // Legitimate cleanup: abort in-flight XHR on unmount
  useEffect(() => {
    return () => {
      xhrRef.current?.abort()
    }
  }, [])

  // Empty deps — reads from refs, never stale
  const sendMessage = useCallback((content: string) => {
    if (!conversationIdRef.current || isStreamingRef.current) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    }

    isStreamingRef.current = true
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isStreaming: true,
      streamingContent: "",
      error: null,
    }))

    let processedLength = 0
    let sseBuffer = ""
    let fullContent = ""

    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr

    xhr.onprogress = () => {
      const newText = xhr.responseText.slice(processedLength)
      processedLength = xhr.responseText.length
      sseBuffer += newText

      const lines = sseBuffer.split("\n")
      sseBuffer = lines.pop() ?? ""

      const tokens = parseSseTokens(lines)
      if (tokens.length > 0) {
        fullContent += tokens.join("")
        setState((prev) => ({ ...prev, streamingContent: fullContent }))
      }
    }

    xhr.onload = () => {
      fullContent += parseSseTokens(sseBuffer.split("\n")).join("")

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullContent,
        createdAt: new Date().toISOString(),
      }

      isStreamingRef.current = false
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
        isStreaming: false,
        streamingContent: "",
      }))
    }

    xhr.onerror = () => {
      isStreamingRef.current = false
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        streamingContent: "",
        error: "Failed to send message. Please try again.",
      }))
    }

    xhr.onabort = () => {
      isStreamingRef.current = false
      setState((prev) => ({ ...prev, isStreaming: false, streamingContent: "" }))
    }

    xhr.open("POST", apiMessageUrl(conversationIdRef.current!))
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify({ content }))
  }, [])

  return {
    conversationId: state.conversationId,
    messages: state.messages,
    isCreating: state.isCreating,
    isStreaming: state.isStreaming,
    streamingContent: state.streamingContent,
    error: state.error,
    sendMessage,
  }
}
