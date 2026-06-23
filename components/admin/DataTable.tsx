"use client"

import React from "react"
import { usePagination, DOTS } from "@/hooks/usePagination"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface Column<T> {
  header: string
  accessor: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (val: string) => void
  currentPage: number
  totalCount: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function DataTable<T>({
  columns,
  data,
  loading = false,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}: DataTableProps<T>) {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize,
  })

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="space-y-4">
      {/* Search Header */}
      {onSearchChange !== undefined && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-background dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
          />
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-background dark:bg-neutral-900 overflow-x-auto shadow-sm">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 font-medium uppercase text-xs border-b border-neutral-200 dark:border-neutral-800">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-6 py-4 ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    <span className="text-neutral-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-neutral-500">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                >
                  {columns.map((col, i) => (
                    <td key={i} className={`px-6 py-4 align-middle text-neutral-700 dark:text-neutral-300 ${col.className || ""}`}>
                      {col.accessor(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && totalCount > pageSize && (
        <div className="flex items-center justify-between px-2 py-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            Showing Page {currentPage} of {totalPages} ({totalCount} total entries)
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {paginationRange?.map((pageNumber, i) => {
              if (pageNumber === DOTS) {
                return (
                  <span key={i} className="px-2 text-neutral-400">
                    &#8230;
                  </span>
                )
              }

              return (
                <Button
                  key={i}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  onClick={() => onPageChange(pageNumber as number)}
                  className={`h-8 w-8 p-0 text-xs ${
                    pageNumber === currentPage
                      ? "bg-brand hover:bg-brand-hover text-white border-brand hover:border-brand-hover"
                      : ""
                  }`}
                >
                  {pageNumber}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
