"use client"

import { useState } from "react"
import { Bell, Search, Calendar, MapPin, Users, MoreVertical, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Job, Worker, Team } from "@/shared/schema"
import SharedSidebar from "@/components/shared-sidebar"

export default function JobsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [activeTab,setActiveTab] = useState('In progress')
  const [searchQuery, setSearchQuery] = useState("")
  const [sortAsc, setSortAsc] = useState(true)
  const fetchWithError = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    return response.json()
  }
  
  const { data: jobs = [], isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: () => fetchWithError('/api/jobs'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    queryFn: () => fetchWithError('/api/teams'),
    staleTime: 1000 * 60 * 5,
  });
  const { data: workers = [] } = useQuery<Worker[]>({
    queryKey: ['/api/workers'],
    queryFn: () => fetchWithError('/api/workers'),
    staleTime: 1000 * 60 * 5,
  });
  const activeJobs = jobs.filter(job => job.status === 'in_progress');
  const SchJobs = jobs.filter(job => job.status === 'scheduled');
  const completedJobs = jobs.filter(job => job.status === 'completed');
  const archivedJobs = jobs.filter(job => job.status === 'archived');
  
  const statusTabs = [
    { label: "In progress", count: activeJobs.length,jobs:activeJobs },
    { label: "Scheduled", count: SchJobs.length,jobs:SchJobs  },
    { label: "Completed", count: completedJobs.length,jobs:completedJobs },
    { label: "All", count: jobs.length, jobs:jobs },
    { label: "Archived", count: archivedJobs.length,jobs:archivedJobs },
  ]
  const currentTabJobs = statusTabs.find(tab => tab.label === activeTab)?.jobs || []

  const teamIdToName = new Map<number, string>((teams as Team[]).map(t => [t.id, t.name]))
  const workerIdToName = new Map<number, string>((workers as Worker[]).map(w => [w.id, w.name]))

  const visibleJobs = (currentTabJobs as Job[])
    .filter((job) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        (job.address || '').toLowerCase().includes(q) ||
        (job.clientName || '').toLowerCase().includes(q) ||
        (job.jobType || '').toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const aEnd = new Date(a.endTime as any).getTime()
      const bEnd = new Date(b.endTime as any).getTime()
      return sortAsc ? aEnd - bEnd : bEnd - aEnd
    })

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
              <p className="text-gray-500 mt-1">All tasks information will be shown here</p>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
              <Link href="/maps">
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <MapPin className="w-4 h-4" />
                  Map View
                </Button>
              </Link>
              <Link href="/jobs/add">
                <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">+ Add Job</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-8 py-6 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#ff622a]" />
              <Input
                placeholder="Search jobs by address, client or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSortAsc(!sortAsc)} className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1">
                End date ({sortAsc ? 'Soonest first' : 'Latest first'})
                <ChevronLeft className={`w-4 h-4 text-gray-400 ${sortAsc ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 mb-8">
            {statusTabs.map((tab, index) => (
              <div 
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                  activeTab == tab.label
                    ? "bg-[#fff0ea] text-[#ff622a] border border-[#ffd4c5]"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
                onClick={()=>setActiveTab(tab.label)}
              >
                {tab.label} <span className="ml-1">{tab.count}</span>
              </div>
            ))}
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visibleJobs.map((job) => (
              <Card key={job.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#ff622a] rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{job.address}</h3>
                      <Badge variant="secondary" className="bg-[#fff0ea] text-[#ff622a] border-[#ffd4c5]">
                        {job.clientName}
                      </Badge>
                    </div>
                    <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                  </div>

                  <p className="text-gray-600 mb-4">{job.address}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{job.teamId ? (teamIdToName.get(Number(job.teamId)) || `Team ${job.teamId}`) : (job.assignedTo ? (workerIdToName.get(Number(job.assignedTo)) || `User ${job.assignedTo}`) : 'Unassigned')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(job.startTime as any).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })} - {new Date(job.endTime as any).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>

                  <Link href={`/jobs/${job.id}`}>
                    <Button className="w-full bg-[#ff622a] hover:bg-[#fd7d4f] text-white">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
