// Shared pagination hook: controls page index, size, and navigation actions.
import { useState } from 'react'
import { PAGE_SIZE } from '../constants'

export function usePagination(initialPage = 0, initialPageSize = PAGE_SIZE) {
  const [page, setPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPageSize)

  function goNext(totalPages: number) {
    setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))
  }

  function goPrev() {
    setPage((prev) => (prev > 0 ? prev - 1 : prev))
  }

  function reset() {
    setPage(0)
    setPageSize(initialPageSize)
  }

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    goNext,
    goPrev,
    reset
  }
}
