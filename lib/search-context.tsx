"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  clearSearch: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, clearSearch }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearchContext() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider')
  }
  return context
}
