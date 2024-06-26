'use client'

import { QueryClientProvider } from '@tanstack/react-query'

import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/auth-context'
import { queryClient } from '@/lib/react-query'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>{children}</AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
