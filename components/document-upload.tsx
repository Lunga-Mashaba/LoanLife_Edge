"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { loansApi } from "@/lib/api/loans"
import { useLoans } from "@/hooks/use-loans"
import { memo } from "react"

function DocumentUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { refetch } = useLoans()

  const handleFileSelect = async (file: File) => {
    const validTypes = ['.pdf', '.docx']
    const fileExt = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
    
    if (!validTypes.includes(fileExt)) {
      setUploadStatus({
        type: 'error',
        message: 'Only PDF and DOCX files are supported'
      })
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus({
        type: 'error',
        message: 'File size must be less than 10MB'
      })
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000)
      return
    }

    setUploading(true)
    setUploadStatus({ type: null, message: '' })

    try {
      const response = await loansApi.uploadDocument(file)
      
      setUploadStatus({
        type: 'success',
        message: `Loan "${response.loan?.borrower_name || 'Document'}" uploaded successfully!`
      })
      
      // Refresh loan list
      setTimeout(() => {
        refetch()
        setUploadStatus({ type: null, message: '' })
      }, 3000)
    } catch (error: any) {
      const errorMessage = error?.data?.detail || error?.message || 'Failed to upload document'
      setUploadStatus({
        type: 'error',
        message: errorMessage
      })
      setTimeout(() => setUploadStatus({ type: null, message: '' }), 5000)
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
            <p className="text-sm sm:text-base text-card-foreground">Processing document...</p>
            <p className="text-xs text-muted-foreground">Extracting covenants and ESG data</p>
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
          <p className={`text-sm flex-1 ${uploadStatus.type === 'success' ? 'text-[oklch(0.70_0.25_145)]' : 'text-[oklch(0.55_0.20_25)]'}`}>
            {uploadStatus.message}
          </p>
          <button
            onClick={() => setUploadStatus({ type: null, message: '' })}
            className="text-muted-foreground hover:text-card-foreground transition-colors"
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
