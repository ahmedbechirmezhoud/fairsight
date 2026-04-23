import type { Request, Response, NextFunction } from "express"
import type { ZodTypeAny } from "zod"

type RequestSource = "body" | "query" | "params"

export function validate(schema: ZodTypeAny, source: RequestSource = "body") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source])
    if (!result.success) {
      next(result.error)
      return
    }
    ;(req as unknown as Record<string, unknown>)[source] = result.data
    next()
  }
}
