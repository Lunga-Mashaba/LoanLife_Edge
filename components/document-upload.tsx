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
    <Card className="p-4 sm:p-6 bg-card border-border">
      <div className="flex items-center gap-3 mb-4">
        <Upload className="h-5 w-5 text-[oklch(0.55_0.20_220)] flex-shrink-0" />
        <h3 className="text-lg sm:text-xl font-semibold text-card-foreground">Upload Loan Document</h3>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all
          ${isDragging 
            ? 'border-[oklch(0.55_0.20_220)] bg-[oklch(0.55_0.20_220)]/10' 
            : 'border-border hover:border-[oklch(0.55_0.20_220)]/50'
          }
          ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
        onClick={() => !uploading && fileInputRef.current?.click()}
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
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 animate-spin text-[oklch(0.55_0.20_220)]" />
            <p className="text-sm sm:text-base font-medium text-card-foreground">
              {uploadProgress || 'Processing document...'}
            </p>
            <p className="text-xs text-muted-foreground">This may take a few moments</p>
          </div>
        ) : (
          <>
            <FileText className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
            <p className="text-sm sm:text-base font-medium text-card-foreground mb-2">
              Drag and drop a loan document here
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">
              or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, DOCX (max 10MB)
            </p>
          </>
        )}
      </div>

      {uploadStatus.type && (
        <div
          className={`
            mt-4 p-3 sm:p-4 rounded-lg flex items-start gap-3
            ${uploadStatus.type === 'success' 
              ? 'bg-[oklch(0.70_0.25_145)]/20 border border-[oklch(0.70_0.25_145)]/50' 
              : 'bg-[oklch(0.55_0.20_25)]/20 border border-[oklch(0.55_0.20_25)]/50'
            }
          `}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-[oklch(0.70_0.25_145)] flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-[oklch(0.55_0.20_25)] flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${uploadStatus.type === 'success' ? 'text-[oklch(0.70_0.25_145)]' : 'text-[oklch(0.55_0.20_25)]'}`}>
              {uploadStatus.message}
            </p>
            {uploadStatus.details && (
              <p className={`text-xs mt-1 ${uploadStatus.type === 'success' ? 'text-[oklch(0.70_0.25_145)]/80' : 'text-[oklch(0.55_0.20_25)]/80'}`}>
                {uploadStatus.details}
              </p>
            )}
          </div>
          <button
            onClick={() => setUploadStatus({ type: null, message: '' })}
            className="text-muted-foreground hover:text-card-foreground transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </Card>
  )
}

export const MemoizedDocumentUpload = memo(DocumentUpload)
