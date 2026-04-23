import { randomUUID } from "node:crypto"
import type { Conversation, StoredMessage } from "../types"

const conversations = new Map<string, Conversation>()
const conversationMessages = new Map<string, StoredMessage[]>()

export function createConversation({
  reportId,
  systemPrompt,
}: {
  reportId: string
  systemPrompt: string
}): Conversation {
  const id = randomUUID()
  const conversation: Conversation = { id, reportId, systemPrompt, createdAt: new Date().toISOString() }
  conversations.set(id, conversation)
  conversationMessages.set(id, [])
  return conversation
}

export function getConversation(id: string): Conversation | null {
  return conversations.get(id) ?? null
}

export function getMessages(id: string): StoredMessage[] | null {
  return conversationMessages.get(id) ?? null
}

export function appendMessages(
  id: string,
  messages: Array<Pick<StoredMessage, "role" | "content">>,
): void {
  const msgs = conversationMessages.get(id)
  if (!msgs) return
  for (const msg of messages) {
    msgs.push({ id: randomUUID(), createdAt: new Date().toISOString(), ...msg })
  }
}
