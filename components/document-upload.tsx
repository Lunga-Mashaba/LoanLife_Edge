"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { loansApi } from "@/lib/api/loans"
import { apiCache } from "@/lib/api/cache"
import { useLoans } from "@/hooks/use-loans"
import { memo } from "react"

function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string>('')
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null; message: string; details?: string }>({ type: null, message: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { refetch } = useLoans()

  const handleFileSelect = async (file: File) => {
    const validTypes = ['.pdf', '.docx']
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!fileExt || !validTypes.includes(fileExt)) {
      setUploadStatus({
        type: 'error',
        message: 'Invalid file type',
        details: 'Only PDF and DOCX files are supported'
      })
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000)
      return
    }

    if (file.size === 0) {
      setUploadStatus({
        type: 'error',
        message: 'File is empty',
        details: 'Please select a valid document file'
      })
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File too large',
        details: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`
      })
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000)
      return
    }

    setUploading(true)
    setUploadProgress('Uploading file...')
    setUploadStatus({ type: null, message: '' })

    try {
      setUploadProgress('Uploading file to server...')
      const response = await loansApi.uploadDocument(file)
      
      setUploadProgress('Processing document...')
      
      // Handle response - backend returns loan, document, and extracted data
      const loan = response.loan || (response as any).loan
      const borrowerName = loan?.borrower_name || 'Document'
      const extracted = response.extracted || (response as any).extracted || {}
      const covenantsCount = extracted.covenants_count || 0
      const esgCount = extracted.esg_clauses_count || 0
      
      // Clear all loan-related cache to force refresh
      apiCache.invalidate('loans:all')
      if (loan?.id) {
        apiCache.invalidate(`loans:${loan.id}`)
        apiCache.invalidate(`loans:${loan.id}:state`)
      }
      // Also clear predictions and ESG cache
      apiCache.invalidatePattern(/predictions:/)
      apiCache.invalidatePattern(/esg:/)
      
      setUploadStatus({
        type: 'success',
        message: `Loan "${borrowerName}" created successfully!`,
        details: `Extracted ${covenantsCount} covenant${covenantsCount !== 1 ? 's' : ''} and ${esgCount} ESG clause${esgCount !== 1 ? 's' : ''}`
      })
      
      setUploadProgress('')
      
      // Refresh loan list immediately
      await refetch()
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setUploadStatus({ type: null, message: '' })
      }, 5000)
    } catch (error: any) {
      console.error('Upload error:', error)
      
      let errorMessage = 'Failed to upload document'
      let errorDetails = 'Please try again or check your connection'
      
      if (error?.status === 400) {
        errorMessage = 'Invalid file'
        errorDetails = error?.data?.detail || 'File format not supported or file is corrupted'
      } else if (error?.status === 413) {
        errorMessage = 'File too large'
        errorDetails = 'File exceeds server size limit'
      } else if (error?.status === 500) {
        errorMessage = 'Server error'
        errorDetails = error?.data?.detail || 'The server encountered an error processing your file'
      } else if (error?.status === 408 || error?.message?.includes('timeout')) {
        errorMessage = 'Upload timeout'
        errorDetails = 'The upload took too long. Please try again with a smaller file.'
      } else if (error?.message) {
        errorDetails = error.message
      }
      
      setUploadStatus({
        type: 'error',
        message: errorMessage,
        details: errorDetails
      })
      setUploadProgress('')
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 8000)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <Card className="p-3 sm:p-4 md:p-6 bg-card border-border w-full max-w-full overflow-hidden">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <Upload className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[oklch(0.55_0.20_220)] flex-shrink-0" />
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-card-foreground truncate">Upload Loan Document</h3>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-4 sm:p-6 md:p-8 lg:p-10 text-center transition-all w-full
          min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex items-center justify-center
          ${isDragging 
            ? 'border-[oklch(0.55_0.20_220)] bg-[oklch(0.55_0.20_220)]/10 scale-[1.02]' 
            : 'border-border hover:border-[oklch(0.55_0.20_220)]/50 active:scale-[0.98]'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer touch-manipulation'}
        `}
        onClick={() => !uploading && fileInputRef.current?.click()}
        role="button"
        tabIndex={uploading ? -1 : 0}
        onKeyDown={(e) => {
          if (!uploading && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
        aria-label="Upload loan document by clicking or dragging and dropping"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 sm:gap-3 w-full max-w-md mx-auto px-2">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 animate-spin text-[oklch(0.55_0.20_220)]" />
            <p className="text-xs sm:text-sm md:text-base font-medium text-card-foreground text-center break-words">
              {uploadProgress || 'Processing document...'}
            </p>
            <p className="text-xs text-muted-foreground text-center break-words">This may take a few moments</p>
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto px-2">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 mx-auto mb-2 sm:mb-3 md:mb-4 text-muted-foreground" />
            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-card-foreground mb-1 sm:mb-2 break-words">
              Drag and drop a loan document here
            </p>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-2 sm:mb-3 md:mb-4 break-words">
              or click to browse
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground break-words">
              Supported formats: PDF, DOCX (max 10MB)
            </p>
          </div>
        )}
      </div>

      {uploadStatus.type && (
        <div
          className={`
            mt-3 sm:mt-4 p-2.5 sm:p-3 md:p-4 rounded-lg flex items-start gap-2 sm:gap-3 w-full max-w-full overflow-hidden
            ${uploadStatus.type === 'success' 
              ? 'bg-[oklch(0.70_0.25_145)]/20 border border-[oklch(0.70_0.25_145)]/50' 
              : 'bg-[oklch(0.55_0.20_25)]/20 border border-[oklch(0.55_0.20_25)]/50'
            }
          `}
          role="alert"
          aria-live="polite"
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[oklch(0.70_0.25_145)] flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-[oklch(0.55_0.20_25)] flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0 pr-1 sm:pr-2">
            <p className={`text-xs sm:text-sm md:text-base font-medium break-words ${uploadStatus.type === 'success' ? 'text-[oklch(0.70_0.25_145)]' : 'text-[oklch(0.55_0.20_25)]'}`}>
              {uploadStatus.message}
            </p>
            {uploadStatus.details && (
              <p className={`text-xs sm:text-sm mt-1 break-words leading-relaxed ${uploadStatus.type === 'success' ? 'text-[oklch(0.70_0.25_145)]/80' : 'text-[oklch(0.55_0.20_25)]/80'}`}>
                {uploadStatus.details}
              </p>
            )}
          </div>
          <button
            onClick={() => setUploadStatus({ type: null, message: '' })}
            className="text-muted-foreground hover:text-card-foreground active:text-card-foreground transition-colors flex-shrink-0 p-1.5 sm:p-2 -mt-1 -mr-1 touch-manipulation min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Dismiss message"
            type="button"
          >
            <X className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5" />
          </button>
        </div>
      )}
    </Card>
  )
}

export const MemoizedDocumentUpload = memo(DocumentUpload)
