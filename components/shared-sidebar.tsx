"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  Home,
  Briefcase,
  Calendar,
  Map,
  Clock,
  DollarSign,
  FileText,
  Users,
  Shield,
  BarChart3,
  LogOut,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface SharedSidebarProps {
  onMinimizeChange?: (isMinimized: boolean) => void
}

const SharedSidebar = ({ onMinimizeChange }: SharedSidebarProps) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [userInfo, setUserInfo] = useState({ email: "", name: "" })
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "demo@constructsync.com"
    const name = localStorage.getItem("userName") || "Demo User"
    setUserInfo({ email, name })

    // Restore persisted sidebar state so it doesn't pop open on route change
    try {
      const persisted = localStorage.getItem("sidebarMinimized")
      if (persisted === "true") {
        setIsMinimized(true)
        onMinimizeChange?.(true)
      }
    } catch {}
  }, [])

  const navigationItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Briefcase, label: "Jobs", href: "/jobs" },
    { icon: Calendar, label: "Timeline", href: "/timeline" },
    { icon: Map, label: "Maps", href: "/maps" },
    { icon: Clock, label: "Timesheet", href: "/timesheet" },
    { icon: DollarSign, label: "Budget", href: "/budget" },
    { icon: FileText, label: "Variations", href: "/variations" },
    { icon: Users, label: "Workers", href: "/workers" },
    { icon: Users, label: "Teams", href: "/teams" },
    { icon: Users, label: "Subcontractors", href: "/subcontractors" },
    { icon: Shield, label: "Safety", href: "/safety" },
    { icon: FileText, label: "Reports", href: "/reports" },
   { icon: BarChart3, label: "Analytics", href: "/analytics" },
  ]

  const toggleMinimize = () => {
    const newMinimizedState = !isMinimized
    setIsMinimized(newMinimizedState)
    onMinimizeChange?.(newMinimizedState)
    try { localStorage.setItem("sidebarMinimized", String(newMinimizedState)) } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div
      className={`${isMinimized ? "w-20" : "w-80"} bg-[#192d47] text-white flex flex-col fixed left-0 top-0 h-full transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        {!isMinimized && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff622a] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <div className="font-bold text-lg">CONSTRUCT</div>
              <div className="font-bold text-lg -mt-1">SYNC</div>
            </div>
          </div>
        )}
        {isMinimized && (
          <div className="w-8 h-8 bg-[#ff622a] rounded-lg flex items-center justify-center mx-auto">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
        )}
        <button onClick={toggleMinimize} className="hover:bg-white/10 p-1 rounded transition-colors">
          <ChevronLeft
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isMinimized ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        {navigationItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href === "/jobs" && pathname.startsWith("/jobs"))
          return (
            <Link key={index} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer transition-colors relative group ${
                  isActive ? "bg-[#ff622a] text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
                title={isMinimized ? item.label : undefined}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isMinimized && <span className="font-medium">{item.label}</span>}
                {isMinimized && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-600">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer group relative">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src="/professional-headshot.png" />
            <AvatarFallback className="bg-[#ff622a] text-white">{getUserInitials(userInfo.name)}</AvatarFallback>
          </Avatar>
          {!isMinimized && (
            <div className="flex-1">
              <div className="font-medium">{userInfo.name}</div>
              <div className="text-sm text-gray-400">{userInfo.email}</div>
            </div>
          )}
          {!isMinimized && (
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-gray-400 hover:text-white" />
            </button>
          )}
          {isMinimized && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <div className="font-medium">{userInfo.name}</div>
              <div className="text-xs text-gray-400">{userInfo.email}</div>
              <button onClick={handleLogout} className="mt-1 text-xs text-red-400 hover:text-red-300">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { SharedSidebar }
export default SharedSidebar
