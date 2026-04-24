# Chat UI, SSE Streaming, Keyboard Control & Markdown Rendering

## Overview

Each report has a dedicated AI assistant that has been briefed on that report's data: location, status, issues, flight metadata, weather conditions. The chat screen is a thin interface over a streaming conversation API. The goal was to deliver a native-feeling chat experience without building a custom streaming framework; use the platform's tools and keep the implementation surface small.

## Conversation Lifecycle

When the user opens the chat for a report, a conversation is created on the server (POST `/api/conversations`) with the report ID. The server builds a system prompt from the report data and stores it in memory alongside the conversation ID. The mobile client holds the `conversationId` in component state and uses it for all subsequent message requests.

Messages are stored server-side per conversation so the history is always consistent with what the model saw. The client does not need to maintain or replay the full message history; it fetches it on mount and appends optimistically as the user sends messages.

## Server-Sent Events

Responses stream over SSE (Server-Sent Events) rather than WebSockets or polling. SSE is the right tool here: the communication is one-directional (server pushes tokens to client), it works over a standard HTTP connection, and it requires no persistent socket management.

The client uses a manual `fetch` + `ReadableStream` reader rather than the browser `EventSource` API, because React Native's `EventSource` support is inconsistent across environments and the custom reader gives full control over the byte stream. Each `data:` line is parsed as JSON. Token chunks (`type: "token"`) are appended to the in-progress message. A `done` event signals completion. An `error` event is surfaced to the UI without crashing the stream.

The in-progress assistant message is held in local component state and rendered live as tokens arrive, giving the character-by-character typing effect. On completion it is merged into the conversation message list.

## Keyboard Control

On mobile, the keyboard covering the input bar is one of the most common sources of janky UX. The chat screen uses `react-native-keyboard-controller` to track keyboard position frame-by-frame through a Reanimated shared value. The message list and input bar translate together with the keyboard in a single animation pass; there is no jump when the keyboard appears or dismisses. This approach works identically on iOS and Android without platform-specific workarounds.

The input bar is anchored to the keyboard using `KeyboardStickyView`, which ensures it always sits directly above the software keyboard regardless of animation state. Tapping outside the input dismisses the keyboard through `keyboardDismissMode="on-drag"` on the message list.

## Message List

The message list is a `FlatList` inverted so new messages appear at the bottom and the list scrolls upward through history. Inverted lists avoid the need to imperatively scroll to the end after each new message; the rendering model naturally places the latest content at the viewport origin.

An animated typing indicator (three pulsing dots) appears while the assistant response is in flight. It is rendered as a regular list item so it participates in the same scroll physics as the message bubbles.

## Markdown Rendering

Assistant responses are rendered with `react-native-markdown-display`. The rationale: AI responses frequently include structured output, bullet lists, bold emphasis, inline code, and rendering raw text would be a worse experience than the web equivalent. The markdown renderer is configured with a custom style map that reads from the app's theme tokens, so heading sizes, code block backgrounds, and text colours all adapt to light and dark mode automatically.

User messages are plain text; only assistant messages go through the markdown renderer.

## Character Limit

A visible character counter appears as the input approaches its limit, giving the user feedback before the send button is disabled. The counter transitions from a neutral colour to a warning colour in the last few characters. This avoids the frustrating experience of silently truncated or rejected messages.
