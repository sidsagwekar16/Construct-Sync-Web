"use client"

import { useState } from "react"
import { Bell, Search, Calendar, MapPin, Users, MoreVertical, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Job, Worker, JobIssue } from "@/shared/schema"
import SharedSidebar from "@/components/shared-sidebar"

export default function JobsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [activeTab,setActiveTab] = useState('in_progress')
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
   const { data: jotifications = [], } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
    queryFn: () => fetchWithError('/api/notifications'),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <MapPin className="w-4 h-4" />
                Map View
              </Button>
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
                className="pl-10 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">End date (Soonest first)</span>
              <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
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
            {currentTabJobs.map((job) => (
              <Card key={job.jobType} className="bg-white border border-gray-200 rounded-lg shadow-sm">
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
                      <span>{job.assignedTo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{job.startTime.toString()} - {job.endTime.toString()}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-[#ff622a] hover:bg-[#fd7d4f] text-white">View Details</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
