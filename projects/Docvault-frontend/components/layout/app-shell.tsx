"use client"

import type { ReactNode } from "react"
import { Header } from "./header"
import { Footer } from "./footer"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
