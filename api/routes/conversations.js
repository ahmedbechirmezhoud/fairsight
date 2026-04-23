const { Router } = require("express");
const { z } = require("zod");
const { findById } = require("../data/reports");
const { createConversation, getConversation, getMessages, appendMessages } = require("../store/memory");
const { buildSystemPrompt } = require("../services/prompt");
const { streamChat } = require("../services/ai");
const { validate } = require("../middleware/validate");

const router = Router();

router.post("/", validate(z.object({ reportId: z.string().min(1) })), (req, res, next) => {
  const { reportId } = req.body;
  const report = findById(reportId);
  if (!report) return res.status(404).json({ error: "Report not found" });

  const systemPrompt = buildSystemPrompt(report);
  const conversation = createConversation({ reportId, systemPrompt });
  res.json({ conversationId: conversation.id });
});

router.post("/:id/messages", validate(z.object({ content: z.string().min(1) })), async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  const conversation = getConversation(id);
  if (!conversation) return res.status(404).json({ error: "Conversation not found" });

  const msgs = getMessages(id);
  const history = msgs.map((m) => ({ role: m.role, content: m.content }));

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const result = streamChat({
      systemPrompt: conversation.systemPrompt,
      history,
      userContent: content,
      abortSignal: req.signal,
    });

    let assistantContent = "";

    for await (const chunk of result.textStream) {
      assistantContent += chunk;
      res.write(`data: ${JSON.stringify({ type: "token", content: chunk })}\n\n`);
    }

    appendMessages(id, [
      { role: "user", content },
      { role: "assistant", content: assistantContent },
    ]);

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    if (err.name === "ZodError") {
      if (!res.headersSent) return res.status(400).json({ error: err.issues });
    }
    console.error("Message stream error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ type: "error", message: "Stream error" })}\n\n`);
      res.end();
    }
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const conversation = getConversation(id);
  if (!conversation) return res.status(404).json({ error: "Conversation not found" });

  const msgs = getMessages(id);
  res.json({ id: conversation.id, reportId: conversation.reportId, messages: msgs });
});

module.exports = router;
