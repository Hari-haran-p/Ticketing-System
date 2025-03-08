"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, Menu, ThumbsDown, ThumbsUp, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
  {
    title: "Tickets",
    href: "/tickets",
    icon: ThumbsDown,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div
        className={cn(
          "h-screen bg-background border-r transition-all duration-300 ease-in-out",
          isOpen ? "w-[20%]" : "w-[60px]",
        )}
      >
        <div className="flex h-14 items-center border-b px-4 justify-between">
          {isOpen && <h1 className="text-lg font-semibold">Public Feedback</h1>}
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
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
                  {isOpen && <span>{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {isOpen && (
          <div className="border-t p-4">
            <p className="text-xs text-muted-foreground">© 2025 Public Feedback System</p>
          </div>
        )}
      </div>
    </>
  )
}

