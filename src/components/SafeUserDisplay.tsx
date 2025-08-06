'use client'

import { useSafeSession } from '@/hooks/useSafeSession'
import { ReactNode } from 'react'

interface SafeUserDisplayProps {
  children?: ReactNode
  fallback?: ReactNode
  loadingComponent?: ReactNode
}

export default function SafeUserDisplay({ 
  children, 
  fallback = null, 
  loadingComponent = <div>Loading...</div> 
}: SafeUserDisplayProps) {
  const { data: session, isLoading } = useSafeSession()

  if (isLoading) {
    return <>{loadingComponent}</>
  }

  if (session?.user) {
    return <>{children}</>
  }

  return <>{fallback}</>
}