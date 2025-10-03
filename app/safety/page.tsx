"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  Plus,
  Eye,
  Pencil,
  AlertTriangle,
  X,
  Calendar,
  AlertCircle,
  FileText,
  User,
  Shield,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import SharedSidebar from "@/components/shared-sidebar"
import { apiRequest } from "@/lib/utils"

export default function SafetyPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedIncident, setSelectedIncident] = useState<any>(null)
  const [showIncidentModal, setShowIncidentModal] = useState(false)
  const [showReportForm, setShowReportForm] = useState(false)

  // Backend data
  const [dashboard, setDashboard] = useState<any>(null)
  const [incidents, setIncidents] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formDateTime, setFormDateTime] = useState("")
  const [formJobId, setFormJobId] = useState<number | null>(null)
  const [formLocation, setFormLocation] = useState("")
  const [formSeverity, setFormSeverity] = useState("")
  const [formType, setFormType] = useState("")
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)
        const [dash, inc, jobsResp] = await Promise.all([
          apiRequest("/api/safety/dashboard"),
          apiRequest("/api/safety/incidents"),
          apiRequest("/api/jobs"),
        ])
        if (!mounted) return
        setDashboard(dash)
        setIncidents(Array.isArray(inc) ? inc : [])
        setJobs(Array.isArray(jobsResp) ? jobsResp : [])
      } catch (e: any) {
        if (!mounted) return
        setError(e?.message || "Failed to load safety data")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchAll()
    return () => { mounted = false }
  }, [])

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "incidents", label: "Incidents" },
    { id: "near-miss", label: "Near Miss" },
    { id: "inspections", label: "Inspections" },
    { id: "hazards", label: "Hazards" },
    { id: "training", label: "Training" },
  ]

  const handleViewIncident = (incident: any) => {
    setSelectedIncident(incident)
    setShowIncidentModal(true)
  }

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#232323]">Safety</h1>
            </div>
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>flutterflow</span>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-medium">F</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="text-gray-500">Dashboard</span>
            <span className="text-gray-400">›</span>
            <span className="text-blue-600">Dashboard</span>
          </div>

          {/* Page Title */}
          <h2 className="text-2xl font-bold text-[#232323] mb-6">Safety Management</h2>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex items-center gap-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-normal border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-[#232323]"
                      : "border-transparent text-gray-500 hover:text-[#232323]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dashboard Tab Content */}
          {activeTab === "dashboard" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {/* Safety Incidents Card */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-lg mb-4">
                      <AlertTriangle className="w-6 h-6 text-[#ff4444]" />
                    </div>
                    <div className="text-4xl font-bold text-[#232323] mb-2">{dashboard?.stats?.incidents?.total ?? 0}</div>
                    <div className="text-sm font-medium text-[#232323] mb-1">Safety Incidents</div>
                    <div className="text-xs text-gray-500">{dashboard?.stats?.incidents?.open ?? 0} open cases</div>
                  </CardContent>
                </Card>

                {/* Near Miss Reports Card */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-lg mb-4">
                      <AlertCircle className="w-6 h-6 text-[#ffa726]" />
                    </div>
                    <div className="text-4xl font-bold text-[#232323] mb-2">{dashboard?.stats?.nearMiss?.total ?? 0}</div>
                    <div className="text-sm font-medium text-[#232323] mb-1">Near Miss Reports</div>
                    <div className="text-xs text-gray-500">{dashboard?.stats?.nearMiss?.highRisk ?? 0} high risk</div>
                  </CardContent>
                </Card>

                {/* Safety Inspections Card */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
                      <CheckCircle className="w-6 h-6 text-[#2196f3]" />
                    </div>
                    <div className="text-4xl font-bold text-[#232323] mb-2">{dashboard?.stats?.inspections?.total ?? 0}</div>
                    <div className="text-sm font-medium text-[#232323] mb-1">Safety Inspections</div>
                    <div className="text-xs text-gray-500">{dashboard?.stats?.inspections?.passed ?? 0} passed</div>
                  </CardContent>
                </Card>

                {/* Hazard Reports Card */}
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-50 rounded-lg mb-4">
                      <Shield className="w-6 h-6 text-[#ff622a]" />
                    </div>
                    <div className="text-4xl font-bold text-[#232323] mb-2">{dashboard?.stats?.hazards?.total ?? 0}</div>
                    <div className="text-sm font-medium text-[#232323] mb-1">Hazard Reports</div>
                    <div className="text-xs text-gray-500">{dashboard?.stats?.hazards?.open ?? 0} open</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Safety Activity */}
              <div>
                <h3 className="text-xl font-semibold text-[#232323] mb-2">Recent Safety Activity</h3>
                <p className="text-sm text-gray-500 mb-6">Latest safety reports and inspections</p>

                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-red-50 rounded-lg">
                          <AlertTriangle className="w-5 h-5 text-[#ff4444]" />
                        </div>
                        <div>
                          <div className="text-base font-semibold text-[#232323] mb-1">{dashboard?.recent?.incidents?.[0]?.title || "—"}</div>
                          <div className="text-sm text-gray-500">{dashboard?.recent?.incidents?.[0]?.incidentDate ? new Date(dashboard.recent.incidents[0].incidentDate).toLocaleDateString() : "—"}</div>
                        </div>
                      </div>
                      <Badge className="bg-[#e8f5e9] text-[#2cb854] hover:bg-[#e8f5e9] border-0">{dashboard?.recent?.incidents?.[0]?.severityLevel || ""}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Incidents Tab Content */}
          {activeTab === "incidents" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#232323]">Safety Incidents</h3>
                <Button
                  className="bg-[#ff622a] hover:bg-[#e55525] text-white flex items-center gap-2"
                  onClick={() => setShowReportForm(true)}
                >
                  <Plus className="w-4 h-4" />
                  Report Incident
                </Button>
              </div>

              {/* Incident Cards */}
              <div className="space-y-4">
                {incidents.map((incident) => (
                  <Card key={incident.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h4 className="text-xl font-bold text-[#232323]">{incident.title || `Incident #${incident.id}`}</h4>
                            <Badge className="bg-[#e8f5e9] text-[#2cb854] hover:bg-[#e8f5e9] border-0">{incident.severityLevel}</Badge>
                            <Badge className="bg-[#e3f2fd] text-[#2196f3] hover:bg-[#e3f2fd] border-0">
                              {incident.status}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              {incident.incidentDate ? new Date(incident.incidentDate).toLocaleDateString() : ""}
                            </p>
                            {incident.locationDescription && (
                              <p className="text-sm text-gray-600">{incident.locationDescription}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-[#232323] hover:bg-gray-100"
                            onClick={() => handleViewIncident(incident)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-[#232323] hover:bg-gray-100"
                          >
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== "incidents" && activeTab !== "dashboard" && (
            <div className="text-center py-12">
              <p className="text-gray-500">Content for {tabs.find((t) => t.id === activeTab)?.label} tab</p>
            </div>
          )}
        </div>
      </div>

      {/* Incident Detail Modal */}
      <Dialog open={showIncidentModal} onOpenChange={setShowIncidentModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-[#ff4444]" />
                <DialogTitle className="text-xl font-semibold text-[#232323]">Safety Incident Details</DialogTitle>
              </div>
              <button
                onClick={() => setShowIncidentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          {selectedIncident && (
            <div className="mt-6">
              {/* Incident Header */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-[#232323]">{selectedIncident.title || `Incident #${selectedIncident.id}`}</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#e8f5e9] text-[#2cb854] hover:bg-[#e8f5e9] border-0">{selectedIncident.severityLevel}</Badge>
                  <Badge className="bg-[#e3f2fd] text-[#2196f3] hover:bg-[#e3f2fd] border-0">
                    {selectedIncident.status}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-8">
                {selectedIncident.incidentType}
              </p>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left Column - Incident Details */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <h4 className="font-semibold text-[#232323]">Incident Details</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                      <p className="text-sm text-[#232323]">{selectedIncident.incidentDate ? new Date(selectedIncident.incidentDate).toLocaleString() : ""}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Job Site</p>
                      <p className="text-sm text-[#232323]">Job #{selectedIncident.jobId}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-[#232323]">{selectedIncident.locationDescription}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Severity Level</p>
                      <p className="text-sm text-[#232323]">{selectedIncident.severityLevel}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Incident Type</p>
                      <p className="text-sm text-[#232323]">{selectedIncident.incidentType}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Reporting Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-4 h-4 text-gray-500" />
                    <h4 className="font-semibold text-[#232323]">Reporting Information</h4>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reported By</p>
                      <p className="text-sm text-[#232323]">User #{selectedIncident.reporterId}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Created</p>
                      <p className="text-sm text-[#232323]">{selectedIncident.createdAt ? new Date(selectedIncident.createdAt).toLocaleString() : ""}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                      <p className="text-sm text-[#232323]">{selectedIncident.updatedAt ? new Date(selectedIncident.updatedAt).toLocaleString() : ""}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-sm text-[#232323]">{selectedIncident.status}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <h4 className="font-semibold text-[#232323]">Description</h4>
                </div>
                <p className="text-sm text-gray-600">{selectedIncident.description}</p>
              </div>

              {/* Follow-up Required Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-gray-500" />
                  <h4 className="font-semibold text-[#232323]">Follow-up Required</h4>
                </div>
                <p className="text-sm text-gray-600">{selectedIncident.investigationCompleted ? "Completed" : "Pending"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report Incident Form Modal */}
      <Dialog open={showReportForm} onOpenChange={setShowReportForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold text-[#232323] mb-2">Report Safety Incident</DialogTitle>
                <p className="text-sm text-gray-500">Fill in the details of the safety incident</p>
              </div>
              <button
                onClick={() => setShowReportForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>

          <form
            className="mt-6 space-y-6"
            onSubmit={async (e) => {
              e.preventDefault()
              if (!formJobId || !formDateTime || !formSeverity || !formType || !formTitle || !formDescription) {
                return
              }
              try {
                setSubmitting(true)
                await apiRequest("/api/safety/incidents", {
                  method: "POST",
                  data: {
                    jobId: formJobId,
                    incidentDate: new Date(formDateTime).toISOString(),
                    incidentType: formType,
                    severityLevel: formSeverity,
                    title: formTitle,
                    description: formDescription,
                    locationDescription: formLocation || undefined,
                  },
                })
                // Refresh lists
                const [inc, dash] = await Promise.all([
                  apiRequest("/api/safety/incidents"),
                  apiRequest("/api/safety/dashboard"),
                ])
                setIncidents(Array.isArray(inc) ? inc : [])
                setDashboard(dash)
                setShowReportForm(false)
                // Reset form
                setFormDateTime("")
                setFormJobId(null)
                setFormLocation("")
                setFormSeverity("")
                setFormType("")
                setFormTitle("")
                setFormDescription("")
              } catch (err) {
                // Optionally surface toast here
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {/* Date & Time and Job Site Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="datetime" className="text-sm font-medium text-[#232323] mb-2 block">
                  Date & Time
                </Label>
                <Input
                  id="datetime"
                  type="datetime-local"
                  placeholder="mm-yyyy --:--"
                  className="w-full"
                  value={formDateTime}
                  onChange={(e) => setFormDateTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="jobsite" className="text-sm font-medium text-[#232323] mb-2 block">
                  Job Site
                </Label>
                <Select
                  onValueChange={(v) => setFormJobId(parseInt(v))}
                  value={formJobId ? String(formJobId) : undefined}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select site..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((j) => (
                      <SelectItem key={j.id} value={String(j.id)}>
                        {j.address || j.name || `Job #${j.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-[#232323] mb-2 block">
                Location
              </Label>
              <Input
                id="location"
                type="text"
                placeholder="Specific location on site..."
                className="w-full"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
              />
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-[#232323] mb-2 block">
                Title
              </Label>
              <Input
                id="title"
                type="text"
                placeholder="Short incident title"
                className="w-full"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
            </div>

            {/* Severity Level and Incident Type Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="severity" className="text-sm font-medium text-[#232323] mb-2 block">
                  Severity Level
                </Label>
                <Select value={formSeverity} onValueChange={setFormSeverity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select severity..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                    <SelectItem value="fatal">Fatal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type" className="text-sm font-medium text-[#232323] mb-2 block">
                  Incident Type
                </Label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="property_damage">Property Damage</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="equipment_failure">Equipment Failure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-[#232323] mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what happened..."
                className="w-full min-h-[120px] resize-none"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            {/* Follow-up Required Checkbox */}
            <div className="flex items-center gap-2">
              <Checkbox id="followup" />
              <Label htmlFor="followup" className="text-sm text-[#232323] cursor-pointer">
                Follow-up required
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowReportForm(false)} className="px-6">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-[#ff622a] hover:bg-[#e55525] text-white px-6">
                Submit Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
