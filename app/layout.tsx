import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Token Pulse - Real-time Web3 Insights',
  description: 'Real-time Web3 insights, delivered instantly. Track token metrics, social sentiment, and on-chain activity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider defaultTheme="default">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
