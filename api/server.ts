import { PORT } from "./config"
import express from "express"
import cors from "cors"
import path from "path"
import { reports } from "./data/reports"
import reportsRouter from "./routes/reports"
import conversationsRouter from "./routes/conversations"
import { errorHandler } from "./middleware/errors"

const app = express()

app.use(cors())
app.use(express.json())
app.use("/images", express.static(path.join(__dirname, "images")))

app.use("/api/reports", reportsRouter)
app.use("/api/conversations", conversationsRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Mock API running at http://localhost:${PORT}`)
  console.log(`Loaded ${reports.length} reports`)
  console.log(`Images served from ${path.join(__dirname, "images")}`)
})
