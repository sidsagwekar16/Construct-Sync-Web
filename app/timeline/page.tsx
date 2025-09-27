"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

export default function TimelinePage() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeView, setActiveView] = useState("Calendar")
  const [activeTimeView, setActiveTimeView] = useState("Week")

  // Sample calendar data
  const calendarEvents = [
    { date: 3, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#ff8c8c]" },
    { date: 4, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#ff8c8c]" },
    { date: 11, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#ff8c8c]" },
    { date: 12, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#ff8c8c]" },
    { date: 15, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#c7ffd7]" },
    { date: 16, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#c7ffd7]" },
    { date: 17, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#c7ffd7]" },
    { date: 18, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#c7ffd7]" },
    { date: 19, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#c7ffd7]" },
    { date: 20, title: "Sitename", tasks: "Task1, Task2, Task3", color: "bg-[#c7ffd7]" },
  ]

  const getDaysInMonth = () => {
    const daysInMonth = 30 // September has 30 days
    const firstDayOfWeek = 0 // September 1st is a Sunday (0)
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
    return calendarEvents.find((event) => event.date === date)
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
              <Button className="bg-[#ff622a] hover:bg-[#d93900] text-white px-6 py-2 rounded-lg">+ Add New Job</Button>
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

          {/* Calendar Section */}
          <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold text-[#232323]">September</h2>
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
                return (
                  <div key={index} className="min-h-[100px] p-2 border border-[#e4e4e7] bg-white">
                    {day && (
                      <>
                        <div className="text-sm font-medium text-[#232323] mb-2">{day}</div>
                        {event && (
                          <div className={`${event.color} rounded-md p-2 text-xs`}>
                            <div className="font-medium text-[#232323]">{event.title}</div>
                            <div className="text-[#232323] opacity-80">{event.tasks}</div>
                          </div>
                        )}
                      </>
                    )}
                    {!day && index === 0 && <div className="text-sm text-[#999999]">31</div>}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
