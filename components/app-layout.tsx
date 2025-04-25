import type React from "react"
import { MobileNav } from "@/components/mobile-nav"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import { QuickActionMenu } from "@/components/quick-action-menu"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DesktopSidebar />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <MobileNav />
      <QuickActionMenu className="fixed bottom-24 right-4 z-50 md:hidden" />
    </div>
  )
}
