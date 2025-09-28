"use client"

import { useState } from "react"
import { Bell, Search, RefreshCw, ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import SharedSidebar from "@/components/shared-sidebar"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"

export default function VariationsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const queryClient = useQueryClient()
  const fetchWithError = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    return response.json()
  }

  const { data: variations = [], isLoading, isError, refetch } = useQuery<any[]>({
    queryKey: ['/api/variations'],
    queryFn: () => fetchWithError('/api/variations'),
    staleTime: 1000 * 60 * 5,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/variations/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/variations'] })
    }
  })

  const openCount = (variations as any[]).filter(v => (v.status || '').toLowerCase() === 'open').length
  const progressCount = (variations as any[]).filter(v => (v.status || '').toLowerCase() === 'in_progress').length
  const completedCount = (variations as any[]).filter(v => (v.status || '').toLowerCase() === 'completed').length
  const highPriorityCount = (variations as any[]).filter(v => (v.priority || '').toLowerCase() === 'high').length

  const filterTabs = [
    { label: "All", count: (variations as any[]).length, active: true },
    { label: "Open", count: openCount, active: false },
    { label: "Progress", count: progressCount, active: false },
    { label: "Completed", count: completedCount, active: false },
    { label: "High Priority", count: highPriorityCount, active: false },
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
          {/* Status Overview */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[{title:'All Variations',count:(variations as any[]).length}, {title:'Open',count:openCount}, {title:'In Progress',count:progressCount}, {title:'Completed',count:completedCount}].map((metric, index) => (
              <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-4">
                  <div className="text-sm text-gray-600 mb-1">{metric.title}</div>
                  <div className="text-3xl font-bold text-gray-900">{metric.count}</div>
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
                <RefreshCw className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => refetch()} />
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

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                  <Skeleton className="h-5 w-1/2 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-3">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-between bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <span>Failed to load variations. Please try again.</span>
              <Button variant="outline" className="bg-white text-red-700 border-red-300" size="sm" onClick={() => refetch()}>Retry</Button>
            </div>
          )}

          {!isLoading && (variations as any[]).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900">No variations found</p>
            </div>
          )}

          {/* Variations List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(variations as any[]).map((v: any) => (
              <Card key={v.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-gray-900">{v.title}</div>
                    <span className="text-xs px-2 py-1 rounded-full border" style={{borderColor:'#ffd4c5', color:'#ff622a', background:'#fff0ea'}}>{(v.status || 'open')}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3 line-clamp-2">{v.description}</div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 mb-4">
                    <div>
                      <div className="text-gray-500">Job</div>
                      <div>{v.jobAddress || v.jobId}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Priority</div>
                      <div className="capitalize">{v.priority || 'medium'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Pricing</div>
                      <div className="capitalize">{v.pricingModel || 'fixed'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Amount</div>
                      <div>${Number(v.clientAmount || 0).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Link href={`/variations/${v.id}`} className="text-[#ff622a] text-sm font-medium">View details</Link>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={deleteMutation.isPending}
                      onClick={() => deleteMutation.mutate(v.id)}
                    >
                      {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
