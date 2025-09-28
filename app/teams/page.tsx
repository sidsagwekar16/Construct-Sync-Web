"use client"

import { SharedSidebar } from "@/components/shared-sidebar"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Team, Worker } from "@/shared/schema"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

export default function TeamsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createName, setCreateName] = useState("")
  const [createDescription, setCreateDescription] = useState("")
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  // Manage modal state
  const [manageTeam, setManageTeam] = useState<Team | null>(null)
  const [manageName, setManageName] = useState("")
  const [manageDescription, setManageDescription] = useState("")
  const [manageMembers, setManageMembers] = useState<number[]>([])
  const [manageLeaderId, setManageLeaderId] = useState<number | null>(null)
  const queryClient = useQueryClient()

  const fetchWithError = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    return response.json()
  }

  const { data: teams = [], isLoading: isTeamsLoading, isError: isTeamsError, refetch: refetchTeams } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
    queryFn: () => fetchWithError('/api/teams'),
    staleTime: 1000 * 60 * 5,
  })

  const { data: workers = [], isLoading: isWorkersLoading, isError: isWorkersError, refetch: refetchWorkers } = useQuery<Worker[]>({
    queryKey: ['/api/workers'],
    queryFn: () => fetchWithError('/api/workers'),
    staleTime: 1000 * 60 * 5,
  })

  const workerIdToName = new Map<number, string>((workers as Worker[]).map((w) => [w.id, w.name]))
  const getAvatarChar = (name?: string | null) => (name && name.length > 0 ? name.substring(0, 1).toUpperCase() : "?")

  const apiRequest = async (url: string, method: string, body?: any) => {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(`${method} ${url} failed: ${res.statusText}`)
    if (res.status === 204) return null
    return res.json()
  }

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      return apiRequest('/api/teams', 'POST', { name: data.name, description: data.description, workerIds: [], leaderId: null })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] })
      setIsCreateOpen(false)
      setCreateName("")
      setCreateDescription("")
    },
  })

  const openManage = (team: Team) => {
    setManageTeam(team)
    setManageName(team.name || "")
    setManageDescription((team as any).description || "")
    setManageMembers([...(team.workerIds || [])])
    setManageLeaderId(team.leaderId || null)
  }

  const updateMutation = useMutation({
    mutationFn: async (data: { id: number; name: string; description?: string }) => {
      return apiRequest(`/api/teams/${data.id}`, 'PATCH', { name: data.name, description: data.description })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] })
      setEditingTeam(null)
    },
  })

  const manageMutation = useMutation({
    mutationFn: async (data: { id: number; name: string; description?: string; workerIds: number[]; leaderId: number | null }) => {
      return apiRequest(`/api/teams/${data.id}`, 'PATCH', {
        name: data.name,
        description: data.description,
        workerIds: data.workerIds,
        leaderId: data.leaderId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] })
      setManageTeam(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/teams/${id}`, 'DELETE')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] })
    },
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Teams</h1>
              <p className="text-gray-600">Create and manage construction teams</p>
            </div>
            <Button className="bg-[#ff622a] hover:bg-[#e55520] text-white px-6 py-3 rounded-lg font-medium transition-colors" onClick={() => setIsCreateOpen(true)}>
              + Create Team
            </Button>
          </div>

          {(isTeamsLoading || isWorkersLoading) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-32 mb-3" />
                  <div className="flex flex-wrap gap-2 mb-6">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Skeleton key={j} className="h-7 w-24 rounded-full" />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {(isTeamsError || isWorkersError) && (
            <div className="flex items-center justify-between bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <span>Failed to load teams. Please try again.</span>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-white text-red-700 border-red-300" size="sm" onClick={() => refetchTeams()}>Retry Teams</Button>
                <Button variant="outline" className="bg-white text-red-700 border-red-300" size="sm" onClick={() => refetchWorkers()}>Retry Workers</Button>
              </div>
            </div>
          )}

          {/* Create Team Form */}
          {isCreateOpen && (
            <div className="mb-6 bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Team Name</label>
                  <Input value={createName} onChange={(e) => setCreateName(e.target.value)} placeholder="Enter team name" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Description</label>
                  <Input value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} placeholder="Optional description" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button disabled={!createName || createMutation.isPending} className="bg-[#ff622a] hover:bg-[#e55520] text-white" onClick={() => createMutation.mutate({ name: createName, description: createDescription || undefined })}>
                  {createMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
                <Button variant="outline" className="bg-transparent" onClick={() => { setIsCreateOpen(false); setCreateName(""); setCreateDescription("") }}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isTeamsLoading && teams.length === 0 && (
            <div className="flex flex-col items-center justify-center bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center mb-6">
              <div className="w-14 h-14 bg-[#fff0ea] text-[#ff622a] rounded-full flex items-center justify-center text-2xl font-bold mb-4">T</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No teams yet</h3>
              <p className="text-gray-600 mb-6">Create your first team to assign workers and manage jobs more effectively.</p>
              <Button className="bg-[#ff622a] hover:bg-[#e55520] text-white" onClick={() => setIsCreateOpen(true)}>Create Team</Button>
            </div>
          )}

          {/* Teams Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team: Team) => (
              <div key={team.id} className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Team Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#ff622a]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#ff622a] font-bold text-lg">{getAvatarChar(team.name)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{team.name}</h3>
                      <p className="text-gray-600 text-sm">{team.description}</p>
                    </div>
                  </div>
                  <span className="bg-[#fff0ea] text-[#ff622a] px-3 py-1 rounded-full text-xs font-medium border border-[#ffd4c5]">
                    {(team.workerIds?.length ?? 0)} members
                  </span>
                </div>

                {/* Team Leader */}
                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-2">Team Leader</p>
                  <p className="font-semibold text-gray-900">{team.leaderId ? (workerIdToName.get(team.leaderId) || `#${team.leaderId}`) : 'Unassigned'}</p>
                </div>

                {/* Members */}
                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-3">Members ({team.workerIds?.length ?? 0})</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(team.workerIds || []).map((memberId: number, index: number) => {
                      const name = workerIdToName.get(memberId) || `#${memberId}`
                      return (
                        <span key={`${memberId}-${index}`} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {name}
                        </span>
                      )
                    })}
                  </div>
                </div>

      {/* Manage Team Modal */}
      {manageTeam && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
          <div className="bg-white border border-gray-200 rounded-xl w-full max-w-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Edit Team</h3>
              <Button variant="outline" className="bg-transparent" onClick={() => setManageTeam(null)}>Close</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Team Name</label>
                <Input value={manageName} onChange={(e) => setManageName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Description</label>
                <Input value={manageDescription} onChange={(e) => setManageDescription(e.target.value)} />
              </div>
            </div>
            <div className="mb-4">
              <p className="text-gray-500 text-sm mb-2">Members</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {manageMembers.map((id) => (
                  <span key={id} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {workerIdToName.get(id) || `#${id}`}
                    <button className="ml-2 text-gray-400 hover:text-gray-700" onClick={() => setManageMembers(manageMembers.filter(x => x !== id))}>×</button>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Tag-style add: pick one, instantly becomes a tag; repeat quickly */}
                <select className="px-3 py-2 border border-gray-200 rounded-lg text-gray-700" onChange={(e) => {
                  const val = parseInt(e.target.value || '0')
                  if (!val) return
                  setManageMembers(prev => Array.from(new Set([...prev, val])))
                  e.currentTarget.value = ''
                }}>
                  <option value="">Add member…</option>
                  {workers
                    .filter(w => !manageMembers.includes(w.id))
                    .sort((a,b) => (a.name || '').localeCompare(b.name || ''))
                    .map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                </select>
                <div className="md:col-span-2">
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-700" value={manageLeaderId ?? ''} onChange={(e) => setManageLeaderId(e.target.value ? parseInt(e.target.value) : null)}>
                  <option value="">Select leader…</option>
                  {manageMembers.map(id => (
                    <option key={id} value={id}>{workerIdToName.get(id) || `#${id}`}</option>
                  ))}
                  </select>
                </div>
                
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <Button className="border border-red-300 text-red-600 hover:bg-red-50" variant="outline" onClick={() => {
                if (confirm('Delete this team?')) deleteMutation.mutate(manageTeam.id)
              }}>Delete Team</Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setManageTeam(null)}>Cancel</Button>
                <Button
                  className="bg-[#ff622a] hover:bg-[#e55520] text-white"
                  disabled={manageMutation.isPending || !manageName}
                  onClick={() => manageMutation.mutate({ id: manageTeam.id, name: manageName, description: manageDescription || undefined, workerIds: manageMembers, leaderId: manageLeaderId })}
                >
                  {manageMutation.isPending ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700" variant="outline" onClick={() => openManage(team)}>
                    Edit Team
                  </Button>
                </div>

                {/* Inline edit removed in favor of modal */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
