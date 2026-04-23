import "dotenv/config"

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  throw new Error("Missing required environment variable: OPENAI_API_KEY")
}

export { PORT, OPENAI_API_KEY }
