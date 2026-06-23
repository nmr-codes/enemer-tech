import { useMemo } from "react"

interface UsePaginationProps {
  totalCount: number
  pageSize: number
  siblingCount?: number
  currentPage: number
}

export const DOTS = "dots"

export function usePagination({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: UsePaginationProps) {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize)

    // Sibling count + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5

    // Case 1: Page count is less than page numbers we want to show
    if (totalPageNumbers >= totalPageCount) {
      const range = []
      for (let i = 1; i <= totalPageCount; i++) {
        range.push(i)
      }
      return range
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPageCount

    // Case 2: No left dots, but right dots to show
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = []
      for (let i = 1; i <= leftItemCount; i++) {
        leftRange.push(i)
      }
      return [...leftRange, DOTS, lastPageIndex]
    }

    // Case 3: No right dots, but left dots to show
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = []
      for (let i = totalPageCount - rightItemCount + 1; i <= totalPageCount; i++) {
        rightRange.push(i)
      }
      return [firstPageIndex, DOTS, ...rightRange]
    }

    // Case 4: Both left and right dots to show
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = []
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        middleRange.push(i)
      }
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
    }

    return []
  }, [totalCount, pageSize, siblingCount, currentPage])

  return paginationRange
}
