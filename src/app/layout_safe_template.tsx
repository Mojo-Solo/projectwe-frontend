import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientSessionProvider from '@/components/ClientSessionProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WeExit - Business Exit Planning Platform',
  description: 'Strategic exit planning and business valuation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientSessionProvider>
          {children}
        </ClientSessionProvider>
      </body>
    </html>
  )
}

// This layout template:
// 1. Uses ClientSessionProvider for client-side session handling
// 2. Avoids useSession at the layout level
// 3. Compatible with SSG/SSR
// 4. Maintains session context for child components