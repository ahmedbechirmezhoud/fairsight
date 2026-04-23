import type { ErrorRequestHandler } from "express"

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) return next(err)

  if (err.name === "ZodError") {
    res.status(400).json({ error: err.issues })
    return
  }

  console.error(err)
  res.status(500).json({ error: "Internal server error" })
}
