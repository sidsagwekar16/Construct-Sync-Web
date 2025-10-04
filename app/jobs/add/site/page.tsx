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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { apiRequest } from "@/lib/api"

export default function SiteInformationPage() {
  const [siteName, setSiteName] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Restore saved site info
  useEffect(() => {
    try {
      const raw = localStorage.getItem("addJobSite")
      if (raw) {
        const s = JSON.parse(raw)
        setSiteName(s.siteName || "")
        setLatitude(s.latitude || "")
        setLongitude(s.longitude || "")
        setNotes(s.notes || "")
      }
    } catch {}
  }, [])

  const saveSite = () => {
    const payload = { siteName, latitude, longitude, notes }
    localStorage.setItem("addJobSite", JSON.stringify(payload))
  }

  const collectPayload = () => {
    const gen = (() => {
      try { return JSON.parse(localStorage.getItem("addJobGeneral") || "{}") } catch { return {} }
    })()
    const team = (() => {
      try { return JSON.parse(localStorage.getItem("addJobTeam") || "{}") } catch { return {} }
    })()
    const site = { siteName, latitude, longitude, notes }

    const payload: any = {
      jobType: gen.jobType,
      address: gen.address,
      clientName: gen.clientName,
      clientPhone: gen.clientPhone || undefined,
      clientEmail: gen.clientEmail || undefined,
      description: gen.notes || undefined,
      startTime: gen.startDate ? new Date(gen.startDate).toISOString() : undefined,
      endTime: gen.endDate ? new Date(gen.endDate).toISOString() : undefined,
      status: "scheduled",
      teamId: team.teamId != null ? String(team.teamId) : undefined,
      workerIds: Array.isArray(team.workerIds) ? team.workerIds : undefined,
      projectManagerIds: team.managerId ? [team.managerId] : undefined,
      assignedTo: team.managerId ?? (Array.isArray(team.workerIds) && team.workerIds.length > 0 ? team.workerIds[0] : undefined),
      notes: site.notes || undefined,
      latitude: site.latitude ? Number(site.latitude) : undefined,
      longitude: site.longitude ? Number(site.longitude) : undefined,
    }
    return payload
  }

  const finish = async () => {
    if (submitting) return
    try {
      setSubmitting(true)
      setError(null)
      saveSite()
      const payload = collectPayload()
      const created = await apiRequest("/api/jobs", "POST", payload)
      // Some backends ignore assignment fields on create. Patch them after create.
      try {
        const createdId = created?.id ?? created?.job?.id
        const { teamId, workerIds, projectManagerIds, assignedTo } = payload as any
        const hasAssignment = Boolean(teamId) || (Array.isArray(workerIds) && workerIds.length > 0) || (Array.isArray(projectManagerIds) && projectManagerIds.length > 0) || Boolean(assignedTo)
        if (createdId && hasAssignment) {
          await apiRequest(`/api/jobs/${createdId}`, "PATCH", {
            teamId,
            workerIds,
            projectManagerIds,
            assignedTo,
          })
        }
      } catch {}
      // cleanup
      localStorage.removeItem("addJobGeneral")
      localStorage.removeItem("addJobTeam")
      localStorage.removeItem("addJobSite")
      window.location.href = "/jobs"
    } catch (e: any) {
      setError(e?.message || "Failed to create job")
    } finally {
      setSubmitting(false)
    }
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
              <Link href="/jobs/add/team">
                <ArrowLeft className="w-6 h-6 text-[#000000] cursor-pointer hover:text-[#ff622a]" />
              </Link>
              <h2 className="text-xl font-semibold text-[#000000]">Site Information</h2>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              <Link href="/jobs/add" className="flex items-center gap-2 px-6 py-3 bg-[#eff0f6] text-[#999999] rounded-full text-sm font-medium hover:bg-[#e0e1e7] transition-colors cursor-pointer">
                General Information
              </Link>
              <Link href="/jobs/add/team" className="flex items-center gap-2 px-6 py-3 bg-[#eff0f6] text-[#999999] rounded-full text-sm font-medium hover:bg-[#e0e1e7] transition-colors cursor-pointer">
                Team Assignment
              </Link>
              <div className="flex items-center gap-2 px-6 py-3 bg-[#fff0ea] text-[#ff622a] rounded-full text-sm font-medium">
                Site Information
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg p-8">
              <div className="space-y-6">
                {error ? <div className="text-red-600 text-sm">{error}</div> : null}
                <div>
                  <label className="block text-[#000000] font-medium mb-2">Site Name</label>
                  <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g. Lot 24 - East Block" className="bg-white border-[#d9d9d9] focus:border-[#ff622a]" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#000000] font-medium mb-2">Latitude</label>
                    <Input value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. -36.8485" className="bg-white border-[#d9d9d9] focus:border-[#ff622a]" />
                  </div>
                  <div>
                    <label className="block text-[#000000] font-medium mb-2">Longitude</label>
                    <Input value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 174.7633" className="bg-white border-[#d9d9d9] focus:border-[#ff622a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[#000000] font-medium mb-2">Notes</label>
                  <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="bg-white border-[#d9d9d9] focus:border-[#ff622a] resize-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#e4e4e7]">
                <Link href="/jobs">
                  <Button variant="outline" className="bg-white border-[#d9d9d9] text-[#000000] hover:bg-[#eff0f6]">
                    Cancel
                  </Button>
                </Link>
                <div className="flex items-center gap-3">
                  <Button className="bg-[#192d47] hover:bg-[#2a4a6b] text-white" onClick={saveSite}>Save</Button>
                  <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white" onClick={finish} disabled={submitting}>{submitting ? "Creating…" : "Finish"}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


