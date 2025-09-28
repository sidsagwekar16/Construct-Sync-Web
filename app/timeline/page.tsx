"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Job, Worker } from "@/shared/schema"
import { isPast, format } from "date-fns"
import Link from "next/link"

export default function TimelinePage() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeView, setActiveView] = useState("Calendar")
  const [activeTimeView, setActiveTimeView] = useState("Month")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

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

  const { data: workers = [] } = useQuery<Worker[]>({
    queryKey: ['/api/workers'],
    queryFn: () => fetchWithError('/api/workers'),
    staleTime: 1000 * 60 * 5,
  })

  const workerIdToName = new Map<number, string>((workers as Worker[]).map(w => [w.id, w.name]))

  const getDaysInMonth = () => {
    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    
    // Get the actual days in the current month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay()
    const days: (number | null)[] = []

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
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()

      const dayJobs = jobs.filter(job => {
        const jobDate = new Date(job.startTime as any)
        return jobDate.getDate() === date && jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear
      })
      
      if (dayJobs.length > 0) {
        const firstJob = dayJobs[0]
        return {
          title: firstJob.jobType || 'Job',
          tasks: `${dayJobs.length} task${dayJobs.length > 1 ? 's' : ''}`,
          type: 'normal',
          job: firstJob
        }
      }
    }
    
    // No event on this date
    return null
  }

  const getCurrentMonth = () => {
    const today = new Date()
    return format(today, 'MMMM yyyy')
  }

  const getCurrentMonthName = () => {
    const today = new Date()
    return format(today, 'MMMM')
  }

  const calcProgress = (job?: Job | null) => {
    if (!job) return 0
    const start = new Date((job as any).startTime as any).getTime()
    const end = new Date((job as any).endTime as any).getTime()
    const now = Date.now()
    if (!start || !end || end <= start) return 0
    const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
    return Math.round(pct)
  }

  const fmtDateShort = (d?: any) => d ? new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'
  const daysAgo = (d?: any) => {
    if (!d) return ''
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / (1000 * 60 * 60 * 24))
    if (diff <= 0) return 'Today'
    return `${diff} day${diff === 1 ? '' : 's'} ago`
  }
  const statusBadge = (status?: string | null) => {
    const s = (status || '').toLowerCase()
    if (s === 'in_progress' || s === 'in-progress') return { label: 'in-progress', cls: 'bg-black text-white' }
    if (s === 'scheduled') return { label: 'scheduled', cls: 'bg-gray-100 text-[#232323]' }
    if (s === 'completed') return { label: 'completed', cls: 'bg-green-100 text-green-700' }
    return { label: s || '—', cls: 'bg-gray-100 text-[#232323]' }
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
                            <button
                              onClick={() => setSelectedJob(event.job)}
                              className={`${event.type === 'urgent' ? 'bg-red-50 border-red-200' : 'bg-[#fff5f0] border-[#ffcab0]'} rounded-md p-2 text-left text-xs border w-full`}
                            >
                              <div className="font-medium text-[#232323] truncate">
                                {event.title}
                              </div>
                              <div className="text-[#666666] text-xs">
                                {event.tasks}
                              </div>
                            </button>
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
              <h3 className="text-lg font-semibold text-[#232323] mb-4">Timeline</h3>
              <div className="space-y-4">
                {jobs
                  .slice()
                  .sort((a: any, b: any) => new Date(a.startTime as any).getTime() - new Date(b.startTime as any).getTime())
                  .map((job) => {
                    const progress = calcProgress(job)
                    const badge = statusBadge(job.status as any)
                    const workerName = job.assignedTo ? (workerIdToName.get(Number(job.assignedTo)) || `#${job.assignedTo}`) : '—'
                    return (
                      <div key={job.id} className="border border-[#e4e4e7] rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff622a' }}></div>
                            <div className="font-medium text-[#232323]">{job.address}</div>
                          </div>
                          <div className="text-xs text-[#999999]">{daysAgo(job.startTime)}</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 text-sm">
                          <div>
                            <div className="text-[#999999]">Client:</div>
                            <div className="text-[#232323]">{job.clientName || '—'}</div>
                          </div>
                          <div>
                            <div className="text-[#999999]">Worker:</div>
                            <div className="text-[#232323]">{workerName}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-[#999999]">Start:</div>
                              <div className="text-[#232323]">{fmtDateShort(job.startTime as any)}</div>
                            </div>
                            <div>
                              <div className="text-[#999999]">End:</div>
                              <div className="text-[#232323]">{fmtDateShort(job.endTime as any)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-sm text-[#999999] mb-2">Progress</div>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-[#ff622a] rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="text-xs text-[#232323]">{progress}%</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* List View */}
          {activeView === "List" && (
            <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#232323]">Jobs</h3>
                <div className="flex gap-2">
                  {['All Jobs','Today','This Week','Overdue','Calendar','Timeline','List'].map((f, idx) => (
                    <Button key={idx} variant={f==='List' ? undefined : 'outline'} className={`${f==='List' ? 'bg-[#232323] text-white' : 'bg-white'} px-3 py-1 h-auto text-xs rounded-full`}>{f}</Button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs font-medium text-[#999999] border-b border-[#e4e4e7]">
                    <div>Job</div>
                    <div>Client</div>
                    <div>Worker</div>
                    <div>Duration</div>
                    <div>Status</div>
                    <div>Progress</div>
                  </div>
                  {jobs.map((job) => {
                    const badge = statusBadge(job.status as any)
                    const progress = calcProgress(job)
                    const workerName = job.assignedTo ? (workerIdToName.get(Number(job.assignedTo)) || `#${job.assignedTo}`) : '—'
                    return (
                      <div key={job.id} className="grid grid-cols-6 gap-4 px-4 py-4 items-center border-b border-[#f0f0f1]">
                        <div>
                          <Link href={`/jobs/${job.id}`} className="font-medium text-[#232323] hover:underline">
                            {job.address}
                          </Link>
                          <div className="text-xs text-[#666666]">{job.jobType}</div>
                        </div>
                        <div className="text-[#232323]">{job.clientName || '—'}</div>
                        <div className="text-[#232323]">{workerName}</div>
                        <div className="text-[#232323]">{fmtDateShort(job.startTime as any)} - {fmtDateShort(job.endTime as any)}</div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs ${badge.cls}`}>{badge.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full ${progress > 0 ? 'bg-blue-500' : 'bg-gray-300'} rounded-full`} style={{ width: `${progress}%` }}></div>
                          </div>
                          <span className="text-xs text-[#232323] w-10 text-right">{progress}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Dialog */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedJob(null)}></div>
          <div className="relative bg-white rounded-xl shadow-2xl border border-[#e4e4e7] w-full max-w-3xl p-6 mx-4">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#232323]">{selectedJob.address}</h2>
              <button className="text-[#999999] hover:text-[#232323]" onClick={() => setSelectedJob(null)}>×</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-semibold text-[#232323] mb-3">Job Details</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-[#666666]">Client:</span> <span className="text-[#232323]">{selectedJob.clientName || '—'}</span></div>
                  <div><span className="text-[#666666]">Type:</span> <span className="text-[#232323]">{selectedJob.jobType || '—'}</span></div>
                  <div><span className="text-[#666666]">Location:</span> <span className="text-[#232323]">{selectedJob.address?.split(',')[1]?.trim() || selectedJob.address}</span></div>
                  <div><span className="text-[#666666]">Worker:</span> <span className="text-[#232323]">{selectedJob.assignedTo ? (workerIdToName.get(Number(selectedJob.assignedTo)) || `#${selectedJob.assignedTo}`) : '—'}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-[#232323] mb-3">Schedule</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-[#666666]">Start Date:</span> <span className="text-[#232323]">{new Date((selectedJob as any).startTime as any).toLocaleDateString()}</span></div>
                  <div><span className="text-[#666666]">End Date:</span> <span className="text-[#232323]">{new Date((selectedJob as any).endTime as any).toLocaleDateString()}</span></div>
                  <div><span className="text-[#666666]">Status:</span> <span className="inline-block bg-black text-white text-xs px-2 py-0.5 rounded-full">{(selectedJob.status || '').replace('_','-')}</span></div>
                  <div><span className="text-[#666666]">Priority:</span> <span className="inline-block bg-gray-100 text-[#232323] text-xs px-2 py-0.5 rounded-full">{selectedJob.priority || '—'}</span></div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-[#232323] mb-3">Progress</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${calcProgress(selectedJob)}%` }}></div>
                </div>
                <div className="text-sm text-[#232323]">{calcProgress(selectedJob)}%</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href={`/jobs/${selectedJob.id}`}>
                <Button className="bg-[#232323] hover:bg-black text-white">View Full Job Details</Button>
              </Link>
              <Button variant="outline" className="bg-white">Edit Schedule</Button>
              <Button variant="outline" className="bg-white">Contact Worker</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}