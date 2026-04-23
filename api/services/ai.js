const { streamText } = require("ai");
const { openai } = require("@ai-sdk/openai");

function streamChat({ systemPrompt, history, userContent, abortSignal }) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userContent },
  ];

  return streamText({
    model: openai("gpt-4o-mini"),
    messages,
    maxOutputTokens: 1024,
    abortSignal,
  });
}

module.exports = { streamChat };
