"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Job } from "@/shared/schema"
import { isPast, format } from "date-fns"

export default function TimelinePage() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeView, setActiveView] = useState("Calendar")
  const [activeTimeView, setActiveTimeView] = useState("Month")

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

  // Sample events for demonstration (remove when jobs API is working)


  const getDaysInMonth = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Get the actual days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEventForDate = (date: number) => {
    // First try to get from jobs data
    if (jobs && jobs.length > 0) {
      const targetDate = new Date()
      targetDate.setDate(date)
      
      const dayJobs = jobs.filter(job => {
        const jobDate = new Date(job.startTime)
        return jobDate.getDate() === date
      })
      
      if (dayJobs.length > 0) {
        const firstJob = dayJobs[0]
        return {
          title: firstJob.jobType || 'Job',
          tasks: `${dayJobs.length} task${dayJobs.length > 1 ? 's' : ''}`,
          type: 'normal'
        }
      }
    }
    
    // Fallback to sample events
    
  }

  const getCurrentMonth = () => {
    const today = new Date()
    return format(today, 'MMMM yyyy')
  }

  const getCurrentMonthName = () => {
    const today = new Date()
    return format(today, 'MMMM')
  }

  return (
    <div className="flex min-h-screen bg-[#f6f6f6]">
      <SharedSidebar onMinimizeChange={setIsMinimized} />

      <div className={`flex-1 transition-all duration-300 ${isMinimized ? "ml-20" : "ml-80"}`}>
        <div className="p-8">
          {/* Header */}
          <div className="bg-white rounded-lg p-6 mb-6 border border-[#e4e4e7]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#232323] mb-2">Schedule & Timeline</h1>
                <p className="text-[#999999]">Manage and view all jobs across different timelines</p>
              </div>
              <Button className="bg-[#ff622a] hover:bg-[#d93900] text-white px-6 py-2 rounded-lg">
                + Add New Job
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Input
                placeholder="Search variations..."
                className="pl-4 pr-12 py-3 rounded-full border border-[#e4e4e7] bg-white"
              />
              <Button
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#ff622a] hover:bg-[#d93900] text-white rounded-full p-2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* View Toggle Buttons */}
          <div className="flex gap-4 mb-6">
            {["Calendar", "Timeline", "List"].map((view) => (
              <Button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-8 py-3 rounded-full font-medium transition-all ${
                  activeView === view
                    ? "bg-[#ff622a] text-white"
                    : "bg-white text-[#999999] border border-[#e4e4e7] hover:bg-[#f6f6f6]"
                }`}
              >
                {view}
              </Button>
            ))}
          </div>

          {/* Calendar Section - Only show if Calendar view is active */}
          {activeView === "Calendar" && (
            <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-xl font-semibold text-[#232323]">
                    {getCurrentMonthName()}
                  </h2>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  {["Week", "Month", "Today"].map((timeView) => (
                    <Button
                      key={timeView}
                      onClick={() => setActiveTimeView(timeView)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTimeView === timeView
                          ? "bg-[#f6f6f6] text-[#232323] border border-[#e4e4e7]"
                          : "bg-transparent text-[#999999] hover:bg-[#f6f6f6]"
                      }`}
                    >
                      {timeView}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {/* Day Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-[#999999] bg-[#f6f6f6]">
                    {day}
                  </div>
                ))}

                {/* Calendar Days */}
                {getDaysInMonth().map((day, index) => {
                  const event = day ? getEventForDate(day) : null
                  const today = new Date().getDate()
                  const isToday = day === today
                  
                  return (
                    <div key={`day-${index}`} className="min-h-[100px] p-2 border border-[#e4e4e7] bg-white hover:bg-[#f9f9f9] transition-colors">
                      {day ? (
                        <>
                          <div className={`text-sm font-medium mb-2 ${isToday ? 'text-[#ff622a] font-bold' : 'text-[#232323]'}`}>
                            {day}
                          </div>
                          {event && (
                            <div className={`rounded-md p-2 text-xs ${
                              event.type === 'urgent' 
                                ? 'bg-red-50 border border-red-200' 
                                : 'bg-[#fff5f0] border border-[#ffcab0]'
                            }`}>
                              <div className="font-medium text-[#232323] truncate">
                                {event.title}
                              </div>
                              <div className="text-[#666666] text-xs">
                                {event.tasks}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-sm text-[#cccccc]"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Timeline View */}
          {activeView === "Timeline" && (
            <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
              <h3 className="text-lg font-semibold text-[#232323] mb-4">Timeline View</h3>
              <p className="text-[#999999]">Timeline view coming soon...</p>
            </div>
          )}

          {/* List View */}
          {activeView === "List" && (
            <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
              <h3 className="text-lg font-semibold text-[#232323] mb-4">List View</h3>
              {isJobsLoading ? (
                <p className="text-[#999999]">Loading jobs...</p>
              ) : jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.map((job, index) => (
                    <div key={job.id || index} className="p-4 border border-[#e4e4e7] rounded-lg">
                      <h4 className="font-medium text-[#232323]">{job.jobType || 'Job'}</h4>
                      <p className="text-sm text-[#666666]">{job.address || 'No address'}</p>
                      <p className="text-xs text-[#999999]">{job.status || 'No status'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#999999]">No jobs available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}