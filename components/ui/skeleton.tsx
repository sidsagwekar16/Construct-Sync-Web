import * as React from "react"

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      aria-busy="true"
      aria-live="polite"
    />
  )
}









