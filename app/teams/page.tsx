"use client"

import { SharedSidebar } from "@/components/shared-sidebar"
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Team, Worker } from "@/shared/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function TeamsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createName, setCreateName] = useState("")
  const [createDescription, setCreateDescription] = useState("")
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
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

  const startEdit = (team: Team) => {
    setEditingTeam(team)
    setEditName(team.name || "")
    setEditDescription((team as any).description || "")
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
            <div className="text-gray-600 mb-6">Loading teams...</div>
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
                  <div className="flex flex-wrap gap-2">
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

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700" variant="outline" onClick={() => startEdit(team)}>
                    Edit Team
                  </Button>
                  <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => {
                    if (window.confirm('Delete this team?')) deleteMutation.mutate(team.id)
                  }}>
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>

                {/* Edit form inline */}
                {editingTeam && editingTeam.id === team.id && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Edit Team</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Team Name</label>
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-2">Description</label>
                        <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button disabled={!editName || updateMutation.isPending} className="bg-[#ff622a] hover:bg-[#e55520] text-white" onClick={() => updateMutation.mutate({ id: team.id, name: editName, description: editDescription || undefined })}>
                        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button variant="outline" className="bg-transparent" onClick={() => setEditingTeam(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
