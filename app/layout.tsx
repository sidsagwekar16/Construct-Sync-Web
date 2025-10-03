import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import ReactQueryProvider from "./ReactQueryProvider"

export const metadata: Metadata = {
  title: "Construct Sync App",
  description: "Created by Bluorigin",
 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ReactQueryProvider>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
        </ReactQueryProvider>  
      </body>
    </html>
  )
}
