import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"

import { reportsApi } from "@/services/api/reportsApi"
import type { GetReportsParams } from "@/services/api/reportsApi"

import { queryKeys } from "./queryKeys"

export function useReports(params?: GetReportsParams) {
  return useQuery({
    queryKey: queryKeys.reports.list(params),
    queryFn: () => reportsApi.getReports(params),
    // Keep previous results visible while a new search/filter fetch is in-flight,
    // so the skeleton only shows on the very first load (isLoading=true, no cache),
    // not on every query-key change (search typing). isFetching drives the RefreshControl.
    placeholderData: keepPreviousData,
  })
}

export function useReport(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => reportsApi.getReport(id),
    enabled: !!id,
  })
}

export function useReportImages(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.images(id),
    queryFn: () => reportsApi.getReportImages(id),
    enabled: !!id,
  })
}

/** Call on list item press to warm the detail cache before navigation */
export function usePrefetchReport() {
  const queryClient = useQueryClient()

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.reports.detail(id),
      queryFn: () => reportsApi.getReport(id),
    })
  }
}
