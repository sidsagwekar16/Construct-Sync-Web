"use client"

import { useState } from "react"
import { Bell, Calendar, MapPin, Users, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SharedSidebar from "@/components/shared-sidebar"
import { useQuery } from "@tanstack/react-query";
import { Job, Worker, JobIssue } from "@/shared/schema";
import { getQueryFn } from "@/./lib/utils";  
import { format, startOfWeek, addDays, isPast } from "date-fns";


export default function DashboardPage() {
  interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: Date;
  color: string;
}

  const [sidebarMinimized, setSidebarMinimized] = useState(false)
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
    const { data: variations = [] } = useQuery<any[]>({
    queryKey: ['/api/variations'],
    queryFn: () => fetchWithError('/api/variations'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  // Fetch workers data
  const { data: workers = [], isLoading: isWorkersLoading } = useQuery<Worker[]>({
    queryKey: ['/api/workers'],
    queryFn: () => fetchWithError('/api/workers'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch time entries data
  const { data: timeEntries = [], isLoading: isTimeEntriesLoading } = useQuery<any[]>({
    queryKey: ['/api/time-entries'],
    queryFn: () => fetchWithError('/api/time-entries'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });




  const activeJobs = jobs.filter(job => job.status === 'in_progress');
    const completedToday = jobs.filter(job => {
    const completedDate = new Date(job.completedTime || '');
    const today = new Date();
    return job.status === 'completed' &&
           completedDate.getDate() === today.getDate() &&
           completedDate.getMonth() === today.getMonth() &&
           completedDate.getFullYear() === today.getFullYear();
  });
  const todayJobs = jobs.filter(job => job.status === 'in_progress');
  const activeTeamIds = new Set(
    todayJobs
      .filter(job => job.status === 'in_progress')
      .map(job => job.teamId)
  );
  const teamsActive = activeTeamIds.size;

  const metrics = [
    { label: "Active Jobs", value: jobs.length },
    { label: "Completed Today", value: completedToday.length },
    { label: "Teams Active", value: teamsActive },
    { label: "Variations", value: variations.length },
  ]

const getCalendarItems = () => {
    const today = new Date()
    const calendarItems = []
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayJobs = jobs.filter(job => {
        const jobDate = new Date(job.startTime)
        return jobDate.toDateString() === date.toDateString()
      })
      
      const pendingCount = dayJobs.filter(job => 
        job.status === 'scheduled' || job.status === 'in_progress'
      ).length
      
      const hasOverdue = dayJobs.some(job => 
        isPast(new Date(job.endTime)) && job.status !== 'completed'
      )
      
      const firstJob = dayJobs[0]
      
      calendarItems.push({
        date: format(date, 'dd MMM, EEE'),
        pending: pendingCount > 0 ? `${pendingCount} Pending` : 'No jobs',
        location: firstJob?.address?.split(',')[0] || 'No location',
        jobTask: firstJob?.jobType || 'No jobs',
        overdue: hasOverdue,
        jobCount: dayJobs.length
      })
    }
    
    return calendarItems
  }

  const calendarItems = getCalendarItems()


  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">All general information appears in this section</p>
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          {/* Welcome Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back,</h2>
            <h2 className="text-3xl font-bold text-[#ff622a]">Sid</h2>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
                  <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Active Jobs Today */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Active Jobs Today</h3>
              <Button variant="ghost" className="text-[#ff622a] hover:text-[#fd7d4f] p-0">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {activeJobs.map((job, index) => (
                <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{job.jobType}</h4>
                      <Badge className="bg-[#fff0ea] text-[#ff622a] border-[#ffd4c5] hover:bg-[#fff0ea]">
                        {job.status}
                      </Badge>
                    </div>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[#ff622a]" />
                        <span>{job.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4" />
                        <span>{job.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(job.endTime).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* This Week Calendar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">This Week Calendar</h3>
              <Button variant="ghost" className="text-[#ff622a] hover:text-[#fd7d4f] p-0">
                Full Calendar
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {calendarItems.map((item, index) => (
                <Card key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-900">{item.date}</span>
                      <Badge className="bg-[#192d47] text-white text-xs px-2 py-1">{item.pending}</Badge>
                    </div>
                    <div className="border-l-4 border-[#ff622a] pl-3 bg-[#fff0ea] rounded-r p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">{item.location}</span>
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-500 font-medium">OVERDUE</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">{item.jobTask}</div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Availability */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Availability</h3>
                <Button variant="ghost" className="text-[#ff622a] hover:text-[#fd7d4f] p-0">
                  View All
                </Button>
              </div>
              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {workers.map((person, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#fff0ea] rounded-full flex items-center justify-center">
                          <span className="text-[#ff622a] font-semibold">N</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{person.name}</div>
                          <div className="text-sm text-[#ff622a]">{person.role}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                          {person.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
              <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {timeEntries.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-6 h-6 text-[#ff622a]">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{activity.workerName}</span>
                          <span className="text-gray-600"> Checked in at  {activity.jobName}</span>
                        </div>
                        <Badge className="bg-[#192d47] text-white text-xs px-2 py-1">{activity.date}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
