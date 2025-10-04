"use client"

import {
  ArrowLeft,
  Bell,
  Home,
  Briefcase,
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Users,
  HardHat,
  Shield,
  BarChart3,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { Team, Worker } from "@/shared/schema"

export default function TeamAssignmentPage() {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<number[]>([])
  const [selectedManagerId, setSelectedManagerId] = useState<number | null>(null)
  const [savedNotice, setSavedNotice] = useState<string | null>(null)

  const fetchWithError = async (url: string) => {
    const response = await fetch(url, { credentials: "include" })
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    return response.json()
  }

  const { data: teams = [] } = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    queryFn: () => fetchWithError("/api/teams"),
    staleTime: 1000 * 60 * 5,
  })

  const { data: workers = [] } = useQuery<Worker[]>({
    queryKey: ["/api/workers"],
    queryFn: () => fetchWithError("/api/workers"),
    staleTime: 1000 * 60 * 5,
  })

  // Restore any saved selections for this step
  useEffect(() => {
    try {
      const raw = localStorage.getItem("addJobTeam")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed.teamId !== undefined) setSelectedTeamId(parsed.teamId)
        if (Array.isArray(parsed.workerIds)) setSelectedWorkerIds(parsed.workerIds)
        if (parsed.managerId !== undefined) setSelectedManagerId(parsed.managerId)
      }
    } catch {}
  }, [])

  const workerRole = (w: Worker) => (w.role || "worker").toLowerCase()
  const workerList = useMemo(() => (workers as Worker[]).filter((w) => workerRole(w) === "worker"), [workers])
  const managerList = useMemo(() => (workers as Worker[]).filter((w) => ["manager", "admin"].includes(workerRole(w))), [workers])

  const toggleWorker = (id: number) => {
    setSelectedWorkerIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const clearSavedNoticeLater = () => {
    window.setTimeout(() => setSavedNotice(null), 2000)
  }

  const handleSaveLocal = () => {
    const payload = { teamId: selectedTeamId, workerIds: selectedWorkerIds, managerId: selectedManagerId }
    localStorage.setItem("addJobTeam", JSON.stringify(payload))
    setSavedNotice("Selections saved")
    clearSavedNoticeLater()
  }

  return (
    <div className="flex min-h-screen bg-[#eff0f6]">
      {/* Sidebar */}
      <div className="w-80 bg-[#192d47] text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#2a4a6b]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff622a] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <div className="font-bold text-lg">CONSTRUCT</div>
              <div className="font-bold text-lg">SYNC</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#ff622a] text-white">
              <Briefcase className="w-5 h-5" />
              <span>Jobs</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span>Timeline</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span>Maps</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <Clock className="w-5 h-5" />
              <span>Timesheet</span>
            </Link>
            <Link
              href="/budget"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <DollarSign className="w-5 h-5" />
              <span>Budget</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Variations</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Workers</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <HardHat className="w-5 h-5" />
              <span>Subcontractors</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>Safety</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-[#2a4a6b] transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#2a4a6b]">
          <div className="flex items-center gap-3 px-4 py-3">
            <Image src="/professional-headshot.png" alt="Praneeth" width={40} height={40} className="rounded-full" />
            <div className="flex-1">
              <div className="font-medium">Praneeth</div>
              <div className="text-sm text-[#999999]">praneeth@constructsync.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-[#e4e4e7]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[#000000]">Jobs</h1>
              <p className="text-[#999999] mt-1">All tasks information will be shown here</p>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-6 h-6 text-[#000000]" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button and Title */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/jobs/add">
                <ArrowLeft className="w-6 h-6 text-[#000000] cursor-pointer hover:text-[#ff622a]" />
              </Link>
              <h2 className="text-xl font-semibold text-[#000000]">New Job Details</h2>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                href="/jobs/add"
                className="flex items-center gap-2 px-6 py-3 bg-[#eff0f6] text-[#999999] rounded-full text-sm font-medium hover:bg-[#e0e1e7] transition-colors cursor-pointer"
              >
                General Information
              </Link>
              <div className="flex items-center gap-2 px-6 py-3 bg-[#fff0ea] text-[#ff622a] rounded-full text-sm font-medium">
                Team Assignment
              </div>
              <Link href="/jobs/add/site">
                <div className="flex items-center gap-2 px-6 py-3 bg-[#eff0f6] text-[#999999] rounded-full text-sm font-medium hover:bg-[#e4e4e7] transition-colors">
                  Site Information
                </div>
              </Link>
            </div>

            <div className="space-y-6">
              {/* Select Team Card */}
              <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
                <label className="block text-[#000000] font-medium mb-4">Select Team (Optional)</label>
                {Array.isArray(teams) && teams.length > 0 ? (
                  <div className="space-y-3">
                    {(teams as Team[]).map((t) => (
                      <label key={t.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedTeamId === t.id}
                          onCheckedChange={() => setSelectedTeamId(selectedTeamId === t.id ? null : t.id)}
                          className={selectedTeamId === t.id ? "border-[#ff622a] data-[state=checked]:bg-[#ff622a]" : ""}
                        />
                        <span className="text-[#000000] font-medium">{t.name || `Team ${t.id}`}</span>
                        <span className="text-xs bg-[#fff0ea] text-[#ff622a] px-2 py-1 rounded font-medium">{(t.workerIds?.length ?? 0)} members</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#f8f9fa] border border-[#e4e4e7] rounded-lg p-4 text-center text-[#999999]">No teams available</div>
                )}
              </div>

              {/* Select Individual Workers Card */}
              <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
                <label className="block text-[#000000] font-medium mb-4">Select Individual Workers</label>
                <div className="space-y-3 mb-6">
                  {workerList.length === 0 ? (
                    <div className="text-[#999999]">No workers found</div>
                  ) : (
                    workerList.map((w) => (
                      <label key={w.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedWorkerIds.includes(w.id)}
                          onCheckedChange={() => toggleWorker(w.id)}
                          className={selectedWorkerIds.includes(w.id) ? "border-[#ff622a] data-[state=checked]:bg-[#ff622a]" : ""}
                        />
                        <span className="text-[#000000] font-medium">{w.name || `#${w.id}`}</span>
                        <span className="text-xs bg-[#fff0ea] text-[#ff622a] px-2 py-1 rounded font-medium">WORKER</span>
                      </label>
                    ))
                  )}
                </div>

                {/* Selected Workers Section */}
                <div className="bg-[#fff0ea] rounded-lg p-4">
                  <div className="text-sm text-[#999999] mb-3">Selected Workers</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedWorkerIds.length === 0 ? (
                      <span className="text-[#666666]">None</span>
                    ) : (
                      selectedWorkerIds.map((id) => {
                        const w = (workers as Worker[]).find((x) => x.id === id)
                        const name = w?.name || `#${id}`
                        return (
                          <div key={id} className="flex items-center gap-2 bg-[#192d47] text-white px-3 py-2 rounded-full text-sm">
                            <span>{name}</span>
                            <span className="text-xs text-[#999999]">WORKER</span>
                            <X className="w-4 h-4 cursor-pointer hover:text-[#ff622a]" onClick={() => toggleWorker(id)} />
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Management Assistant Card */}
              <div className="bg-white rounded-lg p-6 border border-[#e4e4e7]">
                <label className="block text-[#000000] font-medium mb-4">
                  Management Assistant <span className="text-[#999999] font-normal">(Project Manager)</span>
                </label>
                <div className="space-y-3">
                  {managerList.length === 0 ? (
                    <div className="text-[#999999]">No managers found</div>
                  ) : (
                    managerList.map((m) => (
                      <label key={m.id} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox
                          checked={selectedManagerId === m.id}
                          onCheckedChange={() => setSelectedManagerId(selectedManagerId === m.id ? null : m.id)}
                          className={selectedManagerId === m.id ? "border-[#ff622a] data-[state=checked]:bg-[#ff622a]" : ""}
                        />
                        <span className="text-[#000000] font-medium">{m.name || `#${m.id}`}</span>
                        <span className="text-xs bg-[#fff0ea] text-[#ff622a] px-2 py-1 rounded font-medium">PROJECT MANAGER</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6">
                <Link href="/jobs">
                  <Button variant="outline" className="bg-white border-[#d9d9d9] text-[#000000] hover:bg-[#eff0f6]">
                    Cancel
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  {savedNotice ? <span className="text-sm text-[#24a148] mr-2">{savedNotice}</span> : null}
                  <Button className="bg-[#192d47] hover:bg-[#2a4a6b] text-white" onClick={handleSaveLocal}>Save</Button>
                  <Link href="/jobs/add/site">
                    <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">Next</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
