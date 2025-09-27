"use client"

import { useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import SharedSidebar from "@/components/shared-sidebar"
import Link from "next/link"

export default function BudgetSummaryPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const metricCards = [
    { icon: "📊", label: "Revenue", value: "$0", color: "text-[#ff622a]" },
    { icon: "💰", label: "Revenue", value: "$0", color: "text-[#ff622a]" },
    { icon: "💸", label: "Total Expense", value: "$0", color: "text-[#ff622a]" },
    { icon: "📈", label: "Total Variations", value: "$0", color: "text-[#ff622a]" },
    { icon: "📊", label: "Profit", value: "$0", color: "text-[#ff622a]" },
  ]

  const tabs = [
    { label: "Revenue", active: false, href: "/budget" },
    { label: "Budget", active: false, href: "/budget" },
    { label: "Expense", active: false, href: "/budget" },
    { label: "Variations", active: false, href: "/budget" },
    { label: "Summary", active: true, href: "/budget/summary" },
  ]

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Cost & Budget</h1>
              <p className="text-gray-500 mt-1">Track revenue, budget and expense</p>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="px-8 py-6 flex-1 overflow-auto">
          <div className="grid grid-cols-5 gap-4 mb-8">
            {metricCards.map((metric, index) => (
              <Card key={index} className="bg-white border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{metric.icon}</span>
                    <span className="text-sm text-gray-600 font-medium">{metric.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {tabs.map((tab, index) => (
              <Link key={index} href={tab.href}>
                <div
                  className={`px-6 py-3 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    tab.active
                      ? "bg-[#fff0ea] text-[#ff622a] border border-[#ffd4c5]"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Financial Summary Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Financial Summary</h2>
              <Button variant="outline" className="text-gray-600 border-gray-300 bg-transparent">
                RESET
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Smart Sorting</h3>
                <div className="relative">
                  <select className="w-full p-3 bg-[#eff0f6] border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none cursor-pointer">
                    <option>Intelligent (Problems First)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Problem Detection</h3>
                <div className="relative">
                  <select className="w-full p-3 bg-[#eff0f6] border border-gray-200 rounded-lg text-sm text-gray-700 appearance-none cursor-pointer">
                    <option>Problem Jobs Only</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
                <Button className="w-full bg-[#ff622a] hover:bg-[#fd7d4f] text-white">Focus Problems</Button>
              </div>
            </div>
          </div>

          {/* Portfolio Overview Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Portfolio Overview</h2>
              <div className="bg-[#192d47] text-white px-3 py-1 rounded-full text-sm font-medium">2 JOBS</div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#eff0f6] rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">$0</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
              <div className="bg-[#fff0ea] rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-[#ff622a] mb-2">$0</div>
                <div className="text-sm text-gray-600">Total Costs</div>
              </div>
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">$0</div>
                <div className="text-sm text-gray-600">Total Profit (0.0%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
