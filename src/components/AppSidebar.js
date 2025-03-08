"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart3, Home, ThumbsDown, ThumbsUp, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "All Feedback",
    href: "/all",
    icon: BarChart3,
  },
  {
    title: "Positive Feedback",
    href: "/positive",
    icon: ThumbsUp,
  },
  {
    title: "Negative Feedback",
    href: "/negative",
    icon: ThumbsDown,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-14 items-center border-b px-4">
            <h1 className="text-lg font-semibold">Public Feedback</h1>
          </div>
          <nav className="flex-1 overflow-auto py-4 px-2">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                      pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">© 2025 Public Feedback System</p>
          </div>
        </div>
      </div>
    </>
  )
}

