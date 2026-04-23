const { randomUUID } = require("node:crypto");

/** @type {Map<string, { id: string, reportId: string, systemPrompt: string, createdAt: string }>} */
const conversations = new Map();

/** @type {Map<string, Array<{ id: string, role: string, content: string, createdAt: string }>>} */
const conversationMessages = new Map();

function createConversation({ reportId, systemPrompt }) {
  const id = randomUUID();
  const conversation = { id, reportId, systemPrompt, createdAt: new Date().toISOString() };
  conversations.set(id, conversation);
  conversationMessages.set(id, []);
  return conversation;
}

function getConversation(id) {
  return conversations.get(id) || null;
}

function getMessages(id) {
  return conversationMessages.get(id) || null;
}

function appendMessages(id, messages) {
  const msgs = conversationMessages.get(id);
  if (!msgs) return;
  for (const msg of messages) {
    msgs.push({ id: randomUUID(), createdAt: new Date().toISOString(), ...msg });
  }
}

module.exports = { createConversation, getConversation, getMessages, appendMessages };
