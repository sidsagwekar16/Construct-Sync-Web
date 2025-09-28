"use client"

import { useEffect, useMemo, useState } from "react"
import { Bell, ChevronDown, MapPin, Calendar, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import SharedSidebar from "@/components/shared-sidebar"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"


export default function TimesheetPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = useMemo(() => (searchParams?.get("tab") === "archived" ? "archived" : "current"), [searchParams])
  const [activeTab, setActiveTab] = useState<"current" | "archived">(initialTab as any)

  useEffect(() => {
    const tabParam = searchParams?.get("tab")
    if ((tabParam === "current" || tabParam === "archived") && tabParam !== activeTab) {
      setActiveTab(tabParam)
    }
  }, [searchParams, activeTab])

  const handleTabChange = (tab: "current" | "archived") => {
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set("tab", tab)
    router.replace(url.pathname + "?" + url.searchParams.toString())
  }
  const fetchWithError = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    return response.json()
  }
   const { data: workers = [], isLoading: isWorkersLoading } = useQuery<Worker[]>({
      queryKey: ['/api/workers'],
      queryFn: () => fetchWithError('/api/workers'),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  
    // Fetch time entries data
    const { data: timeEntries = [], isLoading: isTimeEntriesLoading } = useQuery<any[]>({
      queryKey: ['/api/time-entries/active'],
      queryFn: () => fetchWithError('/api/time-entries/active'),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
    
    // Archived entries (loaded when tab active)
    const { data: archivedEntries = [] } = useQuery<any[]>({
      queryKey: ['/api/time-entries/archived'],
      queryFn: () => fetchWithError('/api/time-entries/archived'),
      enabled: typeof window !== 'undefined' && (searchParams?.get("tab") === 'archived' || activeTab === 'archived'),
      staleTime: 1000 * 60 * 2,
    })

  const [now, setNow] = useState<number>(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000)
    return () => clearInterval(id)
  }, [])

  const activeWorkers = timeEntries

  const computeDurationMs = (checkInIso?: string) => {
    if (!checkInIso) return 0
    const start = new Date(checkInIso).getTime()
    return Math.max(0, now - start)
  }

  const formatHoursMinutes = (ms: number) => {
    const totalMinutes = Math.floor(ms / 60000)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return `${hours}h${minutes.toString().padStart(2, '0')}m`
  }

  const getRate = (entry: any) => {
    // Prefer billingRate, fallback to hourlyRate from joined users
    const rate = Number(entry.billingRate || entry.hourlyRate || 0)
    return isFinite(rate) ? rate : 0
  }

  const getLiveCost = (entry: any) => {
    const durationHours = computeDurationMs(entry.checkInTime) / 3600000
    const rate = getRate(entry)
    return durationHours * rate
  }

  const totals = useMemo(() => {
    const totalCost = activeWorkers.reduce((sum: number, e: any) => sum + getLiveCost(e), 0)
    const totalMs = activeWorkers.reduce((sum: number, e: any) => sum + computeDurationMs(e.checkInTime), 0)
    return { totalCost, totalMs }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWorkers, now])

  const checkoutMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const res = await fetch(`/api/jobs/auto-checkout/${entryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'admin_manual' })
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Checkout failed')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/time-entries/active'] })
      queryClient.refetchQueries({ queryKey: ['/api/time-entries/active'] })
    }
  })

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
          {/* Tabs - Soft UI Segmented Control (Full Width) */}
          <div className="mb-6">
            <div className="relative w-full">
              <div className="relative flex items-center rounded-full bg-white border border-gray-200 shadow-sm shadow-black/5 p-1">
                {/* Active indicator */}
                <div
                  className={`absolute top-1 bottom-1 w-1/2 rounded-full bg-[#fff0ea] border border-[#ffd4c5] transition-all ${
                    activeTab === "current" ? "left-1" : "left-1/2"
                  }`}
                ></div>
                <button
                  onClick={() => handleTabChange("current")}
                  className="relative z-10 flex w-1/2 items-center justify-center"
                >
                  <span className={`py-2 text-sm font-medium ${activeTab === "current" ? "text-[#ff622a]" : "text-gray-600"}`}>
                    Current
                  </span>
                </button>
                <button
                  onClick={() => handleTabChange("archived")}
                  className="relative z-10 flex w-1/2 items-center justify-center"
                >
                  <span className={`py-2 text-sm font-medium ${activeTab === "archived" ? "text-[#ff622a]" : "text-gray-600"}`}>
                    Archived
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Dropdowns (for Current tab) */}
          {activeTab === "current" && (
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
          )}

          {/* Current Tab Content */}
          {activeTab === "current" && (
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
                  <div className="text-3xl font-bold text-gray-900 mb-2">${totals.totalCost.toFixed(2)}</div>
                  <div className="text-sm text-gray-700">Current Labour Cost</div>
                </CardContent>
              </Card>
              <Card className="bg-[#ffeee8] border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-2">{formatHoursMinutes(totals.totalMs)}</div>
                  <div className="text-sm text-gray-700">Total Hours Worked</div>
                </CardContent>
              </Card>
            </div>
          </div>
          )}

          {activeTab === "current" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Active Workers</h2>
            <div className="space-y-4">
              {activeWorkers.map((worker, index) => (
                <Card key={index} className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-gray-900">{worker.workerName}</span>
                          <Badge className="bg-[#d4ffe0] text-[#007822] border-green-200 text-xs">ACTIVE</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{worker.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Check-in : {worker.checkInTime}</span>
                            <Badge className="bg-[#ffa686] text-white text-xs ml-2">Still Working</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#ff622a]" />
                            <span>{worker.jobName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900 bg-[#d4ffe0] px-3 py-1 rounded mb-1">
                            ${getLiveCost(worker).toFixed(2)}
                          </div>
                          <div className="text-sm text-[#ff622a] bg-[#ffeee8] px-3 py-1 rounded">{formatHoursMinutes(computeDurationMs(worker.checkInTime))}</div>
                        </div>
                        <Button 
                          className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white"
                          disabled={checkoutMutation.isPending}
                          onClick={() => checkoutMutation.mutate(worker.id)}
                        >
                          {checkoutMutation.isPending ? 'Checking...' : 'Check out'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          )}

          {activeTab === "current" && (
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
          )}

          {/* Archived Tab Content */}
          {activeTab === "archived" && (
            <div>
              {/* Metric Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-2">Total Hours</div>
                    <div className="text-4xl font-bold text-gray-900">{archivedEntries.reduce((s: number, e: any) => s + (Number(e.hours) || 0), 0)}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-2">Active Entries</div>
                    <div className="text-4xl font-bold text-gray-900">{archivedEntries.length}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-2">Workers</div>
                    <div className="text-4xl font-bold text-gray-900">{new Set(archivedEntries.map((e: any) => e.workerId)).size}</div>
                  </CardContent>
                </Card>
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-600 mb-2">Job Sites</div>
                    <div className="text-4xl font-bold text-gray-900">{new Set(archivedEntries.map((e: any) => e.jobId)).size}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 mb-8 flex-wrap">
                {[
                  { label: "All", active: true },
                  { label: "Today", active: false },
                  { label: "Yesterday", active: false },
                  { label: "This Week", active: false },
                  { label: "Last Week", active: false },
                  { label: "This Month", active: false },
                  { label: "Last Month", active: false },
                  { label: "Last 30 Days", active: false },
                ].map((button, index) => (
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

              {/* Simple archived list */}
              {archivedEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center mb-4">
                    <Download className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">No archives entries found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {archivedEntries.map((e: any) => (
                    <Card key={e.id} className="bg-white border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-700">
                            <div className="font-medium text-gray-900">{e.workerName}</div>
                            <div className="text-gray-600">{e.jobName}</div>
                            <div className="text-gray-500">{new Date(e.checkInTime).toLocaleString()} → {new Date(e.checkOutTime).toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{(e.hours ?? 0).toFixed ? (e.hours as number).toFixed(2) : Number(e.hours || 0).toFixed(2)} h</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
