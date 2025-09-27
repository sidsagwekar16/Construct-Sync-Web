"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import SharedSidebar from "@/components/shared-sidebar"
import Link from "next/link"

export default function BudgetPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const metricCards = [
    { icon: "📊", label: "Revenue", value: "$0", color: "text-[#ff622a]" },
    { icon: "💰", label: "Budget", value: "$0", color: "text-[#ff622a]" },
    { icon: "💸", label: "Total Expense", value: "$0", color: "text-[#ff622a]" },
    { icon: "📈", label: "Total Variations", value: "$0", color: "text-[#ff622a]" },
    { icon: "📊", label: "Profit", value: "$0", color: "text-[#ff622a]" },
  ]

  const tabs = [
    { label: "Revenue", active: true, href: "/budget" },
    { label: "Budget", active: false, href: "/budget" },
    { label: "Expense", active: false, href: "/budget" },
    { label: "Variations", active: false, href: "/budget" },
    { label: "Summary", active: false, href: "/budget/summary" },
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

          {/* Job Pricing Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Job Pricing</h2>
              <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">+ Add Quote</Button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff622a]" />
                <Input
                  placeholder="Search jobs..."
                  className="pl-10 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>High to Low</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            <div className="text-sm text-gray-500 mb-6">2 jobs with pricing</div>

            {/* Job Entries */}
            <div className="space-y-6">
              {[1, 2].map((job) => (
                <div key={job} className="border-b border-gray-100 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#ff622a] rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Site Address</h3>
                    </div>
                    <div className="bg-[#192d47] text-white px-3 py-1 rounded-full text-sm">In Progress</div>
                  </div>

                  <p className="text-gray-600 mb-4">Task1, Task2, Task3</p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">$0</div>
                      <div className="text-sm text-gray-600">Quote</div>
                    </div>
                    <div className="bg-[#fff0ea] rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-[#ff622a] mb-1">$0</div>
                      <div className="text-sm text-gray-600">Costs</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">$0</div>
                      <div className="text-sm text-gray-600">Costs</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
