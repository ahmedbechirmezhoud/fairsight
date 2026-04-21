import type { GetReportsParams } from "@/services/api/reportsApi"

export const queryKeys = {
  reports: {
    all: ["reports"] as const,
    list: (params?: GetReportsParams) => ["reports", "list", params ?? {}] as const,
    detail: (id: string) => ["reports", "detail", id] as const,
    images: (id: string) => ["reports", "images", id] as const,
  },
}
