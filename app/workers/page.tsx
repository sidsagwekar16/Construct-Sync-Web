"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { ChevronDown, Phone, Mail, Users, DollarSign } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Worker } from "@/shared/schema"

export default function WorkersPage() {
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('sidebarMinimized') === 'true' } catch { return false }
    }
    return false
  })
  const queryClient = useQueryClient()
  const [selectedWorker, setSelectedWorker] = useState<any | null>(null)

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/workers/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workers'] })
      setSelectedWorker(null)
    }
  })

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

  const [roleFilter, setRoleFilter] = useState<string>("All Roles")
  const [statusFilter, setStatusFilter] = useState<string>("All Statuses")
  const [typeFilter, setTypeFilter] = useState<string>("All Types")
  const [teamFilter, setTeamFilter] = useState<string>("All Teams")

  const filteredWorkers = workers.filter((w) => {
    const roleOk = roleFilter === "All Roles" || (w.role || "").toLowerCase() === roleFilter.toLowerCase()
    const statusOk = statusFilter === "All Statuses" || (w.status || "").toLowerCase() === statusFilter.toLowerCase().replace(" ", "_")
    const typeOk = typeFilter === "All Types" || (w.type || "").toLowerCase() === typeFilter.toLowerCase()
    const teamOk = teamFilter === "All Teams" || (teamFilter === "Unassigned" ? !w.teamId : `Team ${w.teamId}` === teamFilter)
    return roleOk && statusOk && typeOk && teamOk
  })

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

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="relative">
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Roles</option>
                <option>admin</option>
                <option>manager</option>
                <option>worker</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Statuses</option>
                <option>available</option>
                <option>on_job</option>
                <option>off_duty</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Types</option>
                <option>employee</option>
                <option>subcontractor</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg appearance-none cursor-pointer text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-transparent">
                <option>All Teams</option>
                <option>Unassigned</option>
                {Array.from(new Set(workers.map(w => w.teamId).filter(Boolean))).map((tid) => (
                  <option key={String(tid)}>Team {tid}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  <div className="space-y-3 mb-6">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-between bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <span>Failed to load workers. Please try again.</span>
              <Button variant="outline" size="sm" className="bg-transparent" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          )}

          

          {/* Workers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkers.map((worker) => (
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
                    onClick={() => setSelectedWorker(worker)}
                  >
                    Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                    onClick={() => setSelectedWorker(worker)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Details Modal */}
          {selectedWorker && (
            <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl border border-gray-200 w-full max-w-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedWorker.name}</h3>
                  <Button variant="outline" className="bg-transparent" onClick={() => setSelectedWorker(null)}>Close</Button>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="text-gray-800">{selectedWorker.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Phone</p>
                    <p className="text-gray-800">{selectedWorker.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Role</p>
                    <p className="text-gray-800 capitalize">{selectedWorker.type || selectedWorker.role}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Hourly Rate</p>
                    <p className="text-gray-800">{formatCurrency(selectedWorker.hourlyRate)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500 text-sm mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedWorker.skills || []).map((s: string, i: number) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">Team: {selectedWorker.teamId ? `Team ${selectedWorker.teamId}` : 'Unassigned'}</div>
                  <div className="flex gap-2">
                    <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={deleteMutation.isPending} onClick={() => { if (confirm('Delete this worker?')) deleteMutation.mutate(selectedWorker.id) }}>{deleteMutation.isPending ? 'Deleting…' : 'Delete'}</Button>
                    <Button variant="outline" onClick={() => alert('Edit flow coming soon')}>Edit</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
