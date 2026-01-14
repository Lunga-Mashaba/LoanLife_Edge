import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SearchProvider } from "@/lib/search-context"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "LoanLife Edge - Banking Risk Management Platform",
  description: "AI-powered loan portfolio management with ESG compliance and predictive risk analytics",
  generator: "v0.app",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      {
        url: "/images/copilot-20251227-191010.png",
        type: "image/png",
      },
      {
        url: "/icon.png",
        type: "image/png",
      },
      {
        url: "/favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.png",
    apple: "/images/copilot-20251227-191010.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SearchProvider>
            {children}
          </SearchProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
