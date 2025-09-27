import {
  Bell,
  ChevronDown,
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
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function TimesheetArchivePage() {
  const navigationItems = [
    { icon: Home, label: "Dashboard", active: false, href: "/dashboard" },
    { icon: Briefcase, label: "Jobs", active: false, href: "/" },
    { icon: Calendar, label: "Timeline", active: false, href: "/timeline" },
    { icon: Map, label: "Maps", active: false, href: "/maps" },
    { icon: Clock, label: "Timesheet", active: true, href: "/timesheet" },
    { icon: DollarSign, label: "Budget", active: false, href: "/budget" },
    { icon: FileText, label: "Variations", active: false, href: "/variations" },
    { icon: Users, label: "Workers", active: false, href: "/workers" },
    { icon: Users, label: "Subcontractors", active: false, href: "/subcontractors" },
    { icon: Shield, label: "Safety", active: false, href: "/safety" },
    { icon: BarChart3, label: "Analytics", active: false, href: "/analytics" },
  ]

  const filterButtons = [
    { label: "All", active: true },
    { label: "Today", active: false },
    { label: "Yesterday", active: false },
    { label: "This Week", active: false },
    { label: "Last Week", active: false },
    { label: "This Month", active: false },
    { label: "Last Month", active: false },
    { label: "Last 30 Days", active: false },
  ]

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      {/* Sidebar */}
      <div className="w-80 bg-[#192d47] text-white flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff622a] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <div className="font-bold text-lg">CONSTRUCT</div>
              <div className="font-bold text-lg -mt-1">SYNC</div>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          {navigationItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer transition-colors ${
                  item.active ? "bg-[#ff622a] text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-600">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/professional-headshot.png" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">Praneeth</div>
              <div className="text-sm text-gray-400">praneeth@constructsync.com</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Timesheet</h1>
              <p className="text-gray-500 mt-1">Manage workers log, earnings and other</p>
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          {/* Back Navigation */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/timesheet" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-xl font-bold">Timesheet Archive</span>
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Total Hours</div>
                <div className="text-4xl font-bold text-gray-900">0</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Active Entries</div>
                <div className="text-4xl font-bold text-gray-900">0</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Workers</div>
                <div className="text-4xl font-bold text-gray-900">0</div>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <div className="text-sm text-gray-600 mb-2">Job Sites</div>
                <div className="text-4xl font-bold text-gray-900">0</div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {filterButtons.map((button, index) => (
              <Button
                key={index}
                variant={button.active ? "default" : "outline"}
                className={
                  button.active
                    ? "bg-[#ff622a] hover:bg-[#fd7d4f] text-white"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }
              >
                {button.label}
              </Button>
            ))}
          </div>

          {/* Filter Inputs */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input type="text" placeholder="DD - MM - YYYY" className="bg-white border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input type="text" placeholder="DD - MM - YYYY" className="bg-white border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <Input type="text" placeholder="Search worker, job or notes" className="bg-white border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Worker</label>
              <div className="relative">
                <select className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 appearance-none">
                  <option>All Workers</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-lg font-medium text-gray-900">No archives entries found</p>
          </div>
        </div>
      </div>
    </div>
  )
}
