"use client"

import { useState } from "react"
import { Bell, Search, RefreshCw, ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import SharedSidebar from "@/components/shared-sidebar"

export default function VariationsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const safetyMetrics = [
    { title: "Safety Incidents", count: "0", subtitle: "0 open cases", icon: "🔴" },
    { title: "Near Miss Reports", count: "0", subtitle: "0 high risk", icon: "🔴" },
    { title: "Safety Inspections", count: "0", subtitle: "0 passed", icon: "🔴" },
    { title: "Hazard Reports", count: "0", subtitle: "0 open", icon: "🔴" },
    { title: "Hazard Reports", count: "0", subtitle: "0 open", icon: "🔴" },
  ]

  const filterTabs = [
    { label: "All", count: 0, active: true },
    { label: "Open", count: 0, active: false },
    { label: "Progress", count: 0, active: false },
    { label: "Completed", count: 0, active: false },
    { label: "High Priority", count: 0, active: false },
  ]

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Variations</h1>
              <p className="text-gray-500 mt-1">
                Track contract changes, work requests & project modifications that affect scope or cost.
              </p>
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          {/* Safety Metrics Cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {safetyMetrics.map((metric, index) => (
              <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">{metric.title}</span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.count}</div>
                  <div className="text-sm text-gray-500">{metric.subtitle}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-8">
            {filterTabs.map((tab, index) => (
              <div
                key={index}
                className={`px-6 py-3 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  tab.active
                    ? "bg-[#fff0ea] text-[#ff622a] border border-[#ffd4c5]"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab.label} <span className="ml-1">{tab.count}</span>
              </div>
            ))}
          </div>

          {/* All Variations Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">All Variations</h2>
                <RefreshCw className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>
              <Link href="/variations/add">
                <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">+ Add Variant</Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff622a]" />
                <Input
                  placeholder="Search variations..."
                  className="pl-10 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Newest First</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-600">All Status</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-600">All Priority</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <span className="text-sm text-gray-600">All Jobs</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
              <Download className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900">No variations found for this category</p>
          </div>
        </div>
      </div>
    </div>
  )
}
