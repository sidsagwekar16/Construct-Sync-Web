"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Phone, Mail, Users, DollarSign } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Worker } from "@/shared/schema"

export default function WorkersPage() {
  const [isMinimized, setIsMinimized] = useState(false)

  const fetchWithError = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    return response.json()
  }

  const { data: workers = [], isLoading, isError, refetch } = useQuery<Worker[]>({
    queryKey: ['/api/workers'],
    queryFn: () => fetchWithError('/api/workers'),
    staleTime: 1000 * 60 * 5,
  })

  const getAvatarChar = (w: Worker) => {
    const base = (w.avatar && w.avatar.length > 0) ? w.avatar : (w.name || "?")
    return base.substring(0, 1).toUpperCase()
  }

  const formatCurrency = (rate?: number | null) => `$${Number(rate ?? 0).toFixed(2)}/hr`

  const capitalize = (s?: string | null) => s ? s.charAt(0).toUpperCase() + s.slice(1) : ''

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SharedSidebar onMinimizeChange={setIsMinimized} />

      <div className={`flex-1 transition-all duration-300 ${isMinimized ? "ml-20" : "ml-80"}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Workers</h1>
              <p className="text-gray-600">Manage your construction workforce</p>
            </div>
            <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white px-6 py-3 rounded-lg font-medium">
              + New Worker
            </Button>
          </div>

          {isLoading && (
            <div className="text-gray-600">Loading workers...</div>
          )}

          {isError && (
            <div className="flex items-center justify-between bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <span>Failed to load workers. Please try again.</span>
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Roles</option>
                <option>Employee</option>
                <option>Contractor</option>
                <option>Manager</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Statuses</option>
                <option>Available</option>
                <option>Busy</option>
                <option>On Leave</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Teams</option>
                <option>Alpha Team</option>
                <option>Beta Team</option>
                <option>Gamma Team</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#ff622a] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {getAvatarChar(worker)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{worker.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{(worker.type || worker.role || '').toUpperCase()}</p>
                    </div>
                  </div>
                  <span className="bg-[#ff622a] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {capitalize(worker.status || 'available')}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{worker.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{worker.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{worker.teamId ? `Team ${worker.teamId}` : 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span className="text-sm">{formatCurrency(worker.hourlyRate)}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-900 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {(worker.skills || []).map((skill: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                  >
                    Team
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                  >
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 bg-transparent"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
