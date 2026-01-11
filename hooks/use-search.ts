/**
 * Search hook with debouncing
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Loan } from '@/lib/api/types'

export function useSearch<T extends { borrower_name?: string; loan_amount?: number; [key: string]: any }>(
  items: T[],
  searchKeys: (keyof T)[]
) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [filteredItems, setFilteredItems] = useState<T[]>(items)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Filter items based on search query
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFilteredItems(items)
      return
    }

    const query = debouncedQuery.toLowerCase().trim()
    const filtered = items.filter((item) => {
      return searchKeys.some((key) => {
        const value = item[key]
        if (value === null || value === undefined) return false
        
        // Handle different value types
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        if (typeof value === 'number') {
          return value.toString().includes(query)
        }
        if (Array.isArray(value)) {
          return value.some((v: unknown) => 
            typeof v === 'string' ? v.toLowerCase().includes(query) : false
          )
        }
        return false
      })
    })

    setFilteredItems(filtered)
  }, [items, debouncedQuery, searchKeys])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setDebouncedQuery('')
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
    clearSearch,
    isSearching: debouncedQuery.trim().length > 0,
  }
}
