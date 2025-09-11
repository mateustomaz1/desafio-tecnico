"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store"
import { apiClient } from "@/lib/api"
import { LogOut, Package, BarChart3, User, Menu } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useUIStore } from "@/lib/store"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, clearAuth } = useAuthStore()
  const { sidebarOpen, setSidebarOpen } = useUIStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    apiClient.clearToken()
    clearAuth()
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      name: "Produtos",
      href: "/dashboard/products",
      icon: Package,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-xl font-bold">
                Dashboard
              </Link>

              <nav className="hidden md:flex space-x-4">
                {navigation.map((item) => (
                  <Button key={item.name} variant="ghost" asChild>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="flex items-center space-x-2 px-4">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{user?.name}</span>
                    </div>
                    <nav className="flex flex-col space-y-2">
                      {navigation.map((item) => (
                        <Button key={item.name} variant="ghost" asChild className="justify-start">
                          <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.name}
                          </Link>
                        </Button>
                      ))}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>

              <ThemeToggle />

              <div className="hidden md:flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2025 Desafio Técnico Front-End. Desenvolvido com Next.js e Tailwind CSS.
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Stack: Next.js • Zustand • Zod • Radix UI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
