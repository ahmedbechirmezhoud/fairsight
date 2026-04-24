# Chat & Conversation API

## Context

The API is a mock server. The chat feature is the one part that does real work: it maintains conversation state and streams responses from a language model. Everything else is static data with filtering. The goal is still to minimise complexity, but the chat endpoint must be correct because the mobile experience depends on it.

## Conversation Model

A conversation is created with a `reportId`. At creation time the server fetches the full report record, builds a system prompt that describes the inspection in detail (location, status, issues found, severity levels, flight data, weather conditions), and stores the prompt alongside the conversation ID in memory.

In-memory storage is deliberate. Persistence (a database, a file) would add operational complexity with no benefit for a demonstration. Conversations are short-lived within an evaluation session. The trade-off is that conversations are lost on server restart, which is acceptable here.

## System Prompt

The system prompt is constructed from the report data at conversation creation time, not at message time. This means the model always has the full report context without the report data being re-serialised on every request. The prompt positions the assistant as a knowledgeable analyst for that specific inspection, aware of every detail in the report.

## Streaming

Responses stream over Server-Sent Events. The `ai` SDK's `streamText` function handles the model call and exposes an async iterable `textStream`. The route handler iterates over it, writing each token chunk as a `data:` SSE line to the response. When the stream completes, a `done` event is written and the connection is closed.

The full assistant response is assembled from the token stream and appended to the conversation's message history along with the user message. This ensures that subsequent requests have accurate history context and that the `GET /:id` history endpoint reflects the full conversation.

Abort handling is plumbed through from the Express request signal to the `streamText` call, so disconnecting the client stops the model inference.

## Message History

Each conversation maintains an ordered list of `{ role, content }` pairs. On each new message request the full history is passed to the model so it has context of the entire conversation. The client does not need to send history; it only sends the new user message. The server is the single source of truth for conversation state.

## Error Handling

SSE responses have already sent headers by the time most errors can occur. If an error happens mid-stream, an `error` event is written to the stream before closing. If an error happens before the stream starts (e.g. conversation not found), a normal HTTP error response is returned. The route distinguishes these cases by checking `res.headersSent`.
