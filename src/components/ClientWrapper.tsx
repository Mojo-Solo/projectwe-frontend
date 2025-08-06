'use client'

import { ReactNode, useEffect, useState } from 'react'

interface ClientWrapperProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * ClientWrapper component to handle client-side only rendering
 * Prevents hydration issues during static export
 */
export default function ClientWrapper({ children, fallback = null }: ClientWrapperProps) {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}