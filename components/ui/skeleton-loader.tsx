"use client"

import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
}

export function Skeleton({ 
  className, 
  variant = "rectangular",
  width,
  height 
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-[oklch(0.18_0.03_250)] rounded"
  
  const variantStyles = {
    text: "h-4",
    circular: "rounded-full",
    rectangular: "rounded-lg"
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === "number" ? `${width}px` : width
  if (height) style.height = typeof height === "number" ? `${height}px` : height

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], className)}
      style={style}
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] space-y-3">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="40%" />
    </div>
  )
}

export function SkeletonLoanCard() {
  return (
    <div className="p-4 rounded-lg bg-[oklch(0.18_0.03_250)] border border-[oklch(0.25_0.04_250)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" height={12} />
          <Skeleton variant="text" width="60%" height={16} />
        </div>
        <Skeleton variant="text" width="80px" height={20} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton variant="text" width="100px" height={12} />
          <Skeleton variant="text" width="50px" height={12} />
        </div>
        <Skeleton variant="rectangular" height={8} />
      </div>
    </div>
  )
}
