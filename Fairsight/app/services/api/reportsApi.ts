import type { ReportDetail, ReportImagesResponse, ReportsListResponse } from "@/types/api"

import { getGeneralApiProblem } from "./apiProblem"

import { api } from "./index"

export type GetReportsParams = {
  status?: string
  search?: string
}

export const reportsApi = {
  async getReports(params?: GetReportsParams): Promise<ReportsListResponse> {
    const response = await api.apisauce.get<ReportsListResponse>("/api/reports", params)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw new Error(problem?.kind ?? "unknown")
    }

    return response.data!
  },

  async getReport(id: string): Promise<ReportDetail> {
    const response = await api.apisauce.get<ReportDetail>(`/api/reports/${id}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw new Error(problem?.kind ?? "unknown")
    }

    return response.data!
  },

  async getReportImages(id: string): Promise<ReportImagesResponse> {
    const response = await api.apisauce.get<ReportImagesResponse>(`/api/reports/${id}/images`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      throw new Error(problem?.kind ?? "unknown")
    }

    return response.data!
  },
}
