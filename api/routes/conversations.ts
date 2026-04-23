import { Router } from "express"
import { z } from "zod"
import { findById } from "../data/reports"
import { createConversation, getConversation, getMessages, appendMessages } from "../store/memory"
import { buildSystemPrompt } from "../services/prompt"
import { streamChat } from "../services/ai"
import { validate } from "../middleware/validate"

const router = Router()

router.post(
  "/",
  validate(z.object({ reportId: z.string().min(1) })),
  (req, res) => {
    const { reportId } = req.body as { reportId: string }
    const report = findById(reportId)
    if (!report) {
      res.status(404).json({ error: "Report not found" })
      return
    }

    const systemPrompt = buildSystemPrompt(report)
    const conversation = createConversation({ reportId, systemPrompt })
    res.json({ conversationId: conversation.id })
  },
)

router.post(
  "/:id/messages",
  validate(z.object({ content: z.string().min(1) })),
  async (req, res, next) => {
    const id = req.params.id as string
    const { content } = req.body as { content: string }

    const conversation = getConversation(id)
    if (!conversation) {
      res.status(404).json({ error: "Conversation not found" })
      return
    }

    const msgs = getMessages(id) ?? []
    const history = msgs.map((m) => ({ role: m.role, content: m.content }))

    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")

    try {
      const result = streamChat({
        systemPrompt: conversation.systemPrompt,
        history,
        userContent: content,
        abortSignal: (req as unknown as { signal?: AbortSignal }).signal,
      })

      let assistantContent = ""

      for await (const chunk of result.textStream) {
        assistantContent += chunk
        res.write(`data: ${JSON.stringify({ type: "token", content: chunk })}\n\n`)
      }

      appendMessages(id, [
        { role: "user", content },
        { role: "assistant", content: assistantContent },
      ])

      res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`)
      res.end()
    } catch (err) {
      const error = err as Error & { issues?: unknown[] }
      if (error.name === "ZodError") {
        if (!res.headersSent) {
          res.status(400).json({ error: error.issues })
          return
        }
      }
      console.error("Message stream error:", err)
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal server error" })
      } else {
        res.write(`data: ${JSON.stringify({ type: "error", message: "Stream error" })}\n\n`)
        res.end()
      }
    }
  },
)

router.get("/:id", (req, res) => {
  const id = req.params.id as string
  const conversation = getConversation(id)
  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" })
    return
  }

  const msgs = getMessages(id)
  res.json({ id: conversation.id, reportId: conversation.reportId, messages: msgs })
})

export default router
