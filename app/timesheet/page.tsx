"use client"

import { useState } from "react"
import { Bell, ChevronDown, MapPin, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import SharedSidebar from "@/components/shared-sidebar"

export default function TimesheetPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const activeWorkers = [
    {
      name: "Worker Name",
      date: "DD-MM-YYYY",
      checkIn: "00:00 AM",
      site: "Site Name",
      earnings: "$7837.79",
      hours: "74h53m",
    },
    {
      name: "Worker Name",
      date: "DD-MM-YYYY",
      checkIn: "00:00 AM",
      site: "Site Name",
      earnings: "$7837.79",
      hours: "74h53m",
    },
    {
      name: "Worker Name",
      date: "DD-MM-YYYY",
      checkIn: "00:00 AM",
      site: "Site Name",
      earnings: "$7837.79",
      hours: "74h53m",
    },
  ]

  const expenseProjections = [
    { amount: "$7965.36", period: "+ 1 Hour" },
    { amount: "$8004.04", period: "+ 2 Hours" },
    { amount: "$8215.59", period: "End of Day" },
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
              <h1 className="text-2xl font-bold text-gray-900">Timesheet</h1>
              <p className="text-gray-500 mt-1">Manage workers log, earnings and other</p>
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <div className="px-6 py-3 rounded-lg text-sm font-medium bg-[#fff0ea] text-[#ff622a] border border-[#ffd4c5]">
              Current
            </div>
            <Link href="/timesheet/archive">
              <div className="px-6 py-3 rounded-lg text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 cursor-pointer">
                Archived
              </div>
            </Link>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer">
              <span className="text-sm text-gray-700">All Time</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer">
              <span className="text-sm text-gray-700">All Workers</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Real Time Labour Tracking */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Real Time Labour Tracking</h2>
            </div>

            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" className="flex items-center gap-2 bg-gray-100 border-gray-200">
                <MapPin className="w-4 h-4" />
                Live Map View
              </Button>
              <Badge className="bg-[#192d47] text-white px-3 py-1">3 Active</Badge>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <Card className="bg-[#d4ffe0] border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">$7837.79</div>
                  <div className="text-sm text-gray-700">Current Labour Cost</div>
                </CardContent>
              </Card>
              <Card className="bg-[#ffeee8] border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-2">223h59m</div>
                  <div className="text-sm text-gray-700">Total Hours Worked</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Active Workers */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Active Workers</h2>
            <div className="space-y-4">
              {activeWorkers.map((worker, index) => (
                <Card key={index} className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-gray-900">{worker.name}</span>
                          <Badge className="bg-[#d4ffe0] text-[#007822] border-green-200 text-xs">ACTIVE</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{worker.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Check-in : {worker.checkIn}</span>
                            <Badge className="bg-[#ffa686] text-white text-xs ml-2">Still Working</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#ff622a]" />
                            <span>{worker.site}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 bg-[#d4ffe0] px-3 py-1 rounded mb-1">
                            {worker.earnings}
                          </div>
                          <div className="text-sm text-[#ff622a] bg-[#ffeee8] px-3 py-1 rounded">{worker.hours}</div>
                        </div>
                        <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">Check out</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Expense Projections */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Expense Projections</h2>

            {/* Top Row - Projection Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {expenseProjections.map((projection, index) => (
                <Card key={index} className="bg-white border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">{projection.amount}</div>
                    <div className="text-sm text-gray-600">{projection.period}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Row - Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">0h</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </CardContent>
              </Card>
              <Card className="bg-[#d4ffe0] border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-[#007822] mb-2">03</div>
                  <div className="text-sm text-gray-700">Active Workers</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">0h</div>
                  <div className="text-sm text-gray-600">Avg/Worker</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
