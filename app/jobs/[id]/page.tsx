"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import SharedSidebar from "@/components/shared-sidebar"

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="text-gray-500 mt-1">All tasks information will be shown here</p>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex-1 overflow-auto">
          {/* Back Navigation */}
          <Link href="/jobs" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Jobs</span>
          </Link>

          {/* Site Name */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-[#ff622a] rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-900">Site Name</h2>
          </div>

          {/* Job Status */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Job in Progress</h3>
                  <p className="text-gray-500 text-sm">Work is currently in progress</p>
                </div>
                <Button className="bg-[#2cb854] hover:bg-[#28a100] text-white">Mark Complete</Button>
              </div>
            </CardContent>
          </Card>

          {/* Job Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Description */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 bg-[#ff622a] rounded"></div>
                    <h4 className="font-medium text-gray-900">Description</h4>
                  </div>
                  <p className="text-gray-600 text-sm">This is a template description for this job post.</p>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-[#ff622a]" />
                    <h4 className="font-medium text-gray-900">Schedule</h4>
                  </div>
                  <p className="text-gray-600 text-sm">Sunday, 21 Sep 2025 - Sunday, 27 Sep 2025</p>
                </CardContent>
              </Card>

              {/* Weather */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 bg-[#ff622a] rounded-full"></div>
                    <h4 className="font-medium text-gray-900">Weather</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-gray-900">11°C</span>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>🌧️ 15.6 mph</span>
                        <span>💧 0.07 mm</span>
                        <span>🌡️ Feels 9°C</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-red-600">Exterior work might delay</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-600">Good conditions for drywall work</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-4 h-4 bg-[#ff622a] rounded-full"></div>
                    <h4 className="font-medium text-gray-900">Client</h4>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 text-sm">Site Location</p>
                    <p className="text-gray-600 text-sm">1234567890</p>
                    <p className="text-gray-600 text-sm">test@gmail.com</p>
                  </div>
                  <Button className="w-full bg-[#192d47] hover:bg-[#1a2e4a] text-white">Contact</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Manager & Team */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-[#ff622a] rounded-full"></div>
                  <h4 className="font-medium text-gray-900">Job Manager</h4>
                </div>
                <p className="text-gray-500 text-sm">No manager assigned</p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-[#ff622a] rounded-full"></div>
                  <h4 className="font-medium text-gray-900">Team & Workers</h4>
                </div>
                <p className="text-gray-500 text-sm">No information</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Task Management</h3>
            <div className="grid grid-cols-4 gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff622a] mb-2">1</div>
                <div className="text-sm text-gray-600">Total Blocks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">0</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#2cb854] mb-2">1</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff4a44] mb-2">3</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>

            {/* Block Progress */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Block Progress</h4>
                <span className="text-sm text-gray-500">0% Complete</span>
              </div>
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-[#ff622a] rounded-full"></div>
                      <span className="font-medium text-gray-900">Site Name</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">0/2 Tasks</div>
                      <div className="text-xs text-[#ff622a]">1 in progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Media & Documents */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Media & Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Photos */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-[#ff622a] rounded"></div>
                    <h4 className="font-medium text-gray-900">Photos</h4>
                  </div>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-2">No photos yet</p>
                    <p className="text-gray-400 text-xs mb-4">Start by uploading your first photo</p>
                    <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 border-gray-800">
                      Upload Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-[#ff622a] rounded"></div>
                    <h4 className="font-medium text-gray-900">Documents</h4>
                  </div>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <Upload className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm mb-2">No documents yet</p>
                    <p className="text-gray-400 text-xs mb-4">Start by uploading your first document</p>
                    <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-700 border-gray-800">
                      Upload Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Diary & Notes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Job Diary & Notes</h3>
              <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white text-sm">+ Add Entry</Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <Input placeholder="DD - MM - YYYY" className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input placeholder="DD - MM - YYYY" className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input placeholder="Search worker, job or notes" className="border-gray-300" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Worker</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-[#ff622a]">
                  <option>All Workers</option>
                </select>
              </div>
            </div>

            {/* No Entries State */}
            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className="font-medium text-gray-900 mb-2">No Diary Entries Yet.</h4>
                <p className="text-gray-500 text-sm">Click "Add Entry" to start documenting this job.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
