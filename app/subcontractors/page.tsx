"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, Plus, Eye, Edit, DollarSign, FileText, Users, TrendingUp, X } from "lucide-react"
import SharedSidebar from "@/components/shared-sidebar"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiRequest } from "@/lib/api"

export default function SubcontractorsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      try { return localStorage.getItem('sidebarMinimized') === 'true' } catch { return false }
    }
    return false
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [showAddSubcontractor, setShowAddSubcontractor] = useState(false)
  const [showNewContract, setShowNewContract] = useState(false)
  const [showEditContract, setShowEditContract] = useState(false)
  const [showContractDetail, setShowContractDetail] = useState(false)
  const [showRecordPayment, setShowRecordPayment] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedContract, setSelectedContract] = useState<any | null>(null)
  const queryClient = useQueryClient()
  // Local form state: Add Subcontractor
  const [scCompanyName, setScCompanyName] = useState("")
  const [scSpecialty, setScSpecialty] = useState("")
  const [scEmail, setScEmail] = useState("")
  const [scPhone, setScPhone] = useState("")
  const [scAddress, setScAddress] = useState("")
  const [scLicense, setScLicense] = useState("")
  const [scInsuranceExpiry, setScInsuranceExpiry] = useState("")
  const [scError, setScError] = useState<string | null>(null)
  
  // Local form state: New Contract
  const [ncTitle, setNcTitle] = useState("")
  const [ncJobId, setNcJobId] = useState<string>("")
  const [ncType, setNcType] = useState("fixed")
  const [ncSubcontractorId, setNcSubcontractorId] = useState<string>("")
  const [ncCategory, setNcCategory] = useState("electrical")
  const [ncDescription, setNcDescription] = useState("")
  const [ncBaseAmount, setNcBaseAmount] = useState<string>("")
  const [ncVariations, setNcVariations] = useState<string>("")
  const [ncStartDate, setNcStartDate] = useState<string>("")
  const [ncEndDate, setNcEndDate] = useState<string>("")
  const [ncError, setNcError] = useState<string | null>(null)

  const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Request failed')
    return res.json()
  }

  const { data: contracts = [], isLoading } = useQuery({
    queryKey: ['/api/subcontractor-contracts'],
    queryFn: () => fetcher('/api/subcontractor-contracts')
  })

  // Needed lists
  const { data: jobs = [] } = useQuery({
    queryKey: ['/api/jobs'],
    queryFn: () => fetcher('/api/jobs'),
    staleTime: 1000 * 60 * 5,
  })
  const { data: workers = [] } = useQuery({
    queryKey: ['/api/workers'],
    queryFn: () => fetcher('/api/workers'),
    staleTime: 1000 * 60 * 5,
  })
  const subcontractors = (workers as any[]).filter((w) => String(w.type || '').toLowerCase().includes('subcontractor'))

  const filteredContracts = useMemo(() => {
    return (contracts as any[]).filter((c) => {
      const statusOk = statusFilter === 'All Status' || (c.status || '').toLowerCase() === statusFilter.toLowerCase()
      const text = `${c.contractTitle || c.title || ''} ${c.subcontractor?.username || c.subcontractor || ''} ${c.jobId || ''} ${c.category || ''}`.toLowerCase()
      const searchOk = !searchTerm || text.includes(searchTerm.toLowerCase())
      return statusOk && searchOk
    })
  }, [contracts, statusFilter, searchTerm])

  const updateContract = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const res = await fetch(`/api/subcontractor-contracts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) })
      if (!res.ok) throw new Error('Update failed')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subcontractor-contracts'] })
      setShowEditContract(false)
    }
  })

  const createSubcontractor = useMutation({
    mutationFn: async () => {
      // Prefer dedicated subcontractors endpoint if available
      const subcontractorPayload: any = {
        companyName: scCompanyName,
        specialty: scSpecialty || undefined,
        email: scEmail || undefined,
        phone: scPhone || undefined,
        address: scAddress || undefined,
        licenseNumber: scLicense || undefined,
        insuranceExpiry: scInsuranceExpiry || undefined,
      }
      // Fallback worker payload in case backend models subcontractors as workers
      const generatedUsername = scEmail || `${scCompanyName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`
      const workerPayload: any = {
        username: generatedUsername,
        password: 'ChangeMe123!',
        name: scCompanyName,
        email: scEmail || undefined,
        phone: scPhone || undefined,
        address: scAddress || undefined,
        role: 'worker',
        type: 'subcontractor',
        skills: scSpecialty ? [scSpecialty] : undefined,
      }
      try {
        return await apiRequest('/api/subcontractors', 'POST', subcontractorPayload)
      } catch {
        try {
          return await apiRequest('/api/admin/workers', 'POST', workerPayload)
        } catch {
          return await apiRequest('/api/workers', 'POST', workerPayload)
        }
      }
    },
    onMutate: () => setScError(null),
    onError: (e: any) => setScError(e?.message || 'Failed to add subcontractor'),
    onSuccess: () => {
      setShowAddSubcontractor(false)
      setScCompanyName(""); setScSpecialty(""); setScEmail(""); setScPhone(""); setScAddress(""); setScLicense(""); setScInsuranceExpiry("")
      queryClient.invalidateQueries({ queryKey: ['/api/workers'] })
    }
  })

  const createContract = useMutation({
    mutationFn: async () => {
      const body: any = {
        contractTitle: ncTitle,
        jobId: ncJobId ? Number(ncJobId) : undefined,
        subcontractorId: ncSubcontractorId ? Number(ncSubcontractorId) : undefined,
        category: ncCategory,
        contractType: ncType,
        description: ncDescription || undefined,
        baseAmount: ncBaseAmount ? Number(ncBaseAmount) : 0,
        totalVariations: ncVariations ? Number(ncVariations) : 0,
        expectedStartDate: ncStartDate || undefined,
        expectedEndDate: ncEndDate || undefined,
        status: 'pending',
        createdBy: 1,
      }
      return await apiRequest('/api/subcontractor-contracts', 'POST', body)
    },
    onMutate: () => setNcError(null),
    onError: (e: any) => setNcError(e?.message || 'Failed to create contract'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/subcontractor-contracts'] })
      setShowNewContract(false)
      setNcTitle(""); setNcJobId(""); setNcType('fixed'); setNcSubcontractorId(""); setNcCategory('electrical'); setNcDescription(""); setNcBaseAmount(""); setNcVariations(""); setNcStartDate(""); setNcEndDate("")
    }
  })

  const totals = useMemo(() => {
    const list = contracts as any[]
    const totalContracts = list.length
    const active = list.filter((c: any) => (c.status || '').toLowerCase().includes('progress') || (c.status || '').toLowerCase().includes('active')).length
    const totalValue = list.reduce((s: number, c: any) => s + Number(c.baseAmount || 0) + Number(c.totalVariations || 0), 0)
    const totalPaid = list.reduce((s: number, c: any) => s + Number(c.totalPaid || 0), 0)
    return { totalContracts, active, totalValue, totalPaid }
  }, [contracts])

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subcontractor Management</h1>
              <p className="text-gray-500 mt-1">Manage subcontractors and their contracts</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={showAddSubcontractor} onOpenChange={setShowAddSubcontractor}>
                <DialogTrigger asChild>
                  <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subcontractor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Subcontractor</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {scError ? <div className="text-red-600 text-sm">{scError}</div> : null}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" placeholder="ABC Construction Ltd" value={scCompanyName} onChange={(e) => setScCompanyName(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Select value={scSpecialty} onValueChange={setScSpecialty}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select specialty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="hvac">HVAC</SelectItem>
                            <SelectItem value="carpentry">Carpentry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="contact@company.com" value={scEmail} onChange={(e) => setScEmail(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="021-555-0123" value={scPhone} onChange={(e) => setScPhone(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main Street, Auckland" value={scAddress} onChange={(e) => setScAddress(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input id="license" placeholder="LIC123456" value={scLicense} onChange={(e) => setScLicense(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="insurance">Insurance Expiry</Label>
                        <Input id="insurance" type="date" value={scInsuranceExpiry} onChange={(e) => setScInsuranceExpiry(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowAddSubcontractor(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]" disabled={createSubcontractor.isPending || !scCompanyName} onClick={() => createSubcontractor.mutate()}>{createSubcontractor.isPending ? 'Adding…' : 'Add Subcontractor'}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showNewContract} onOpenChange={setShowNewContract}>
                <DialogTrigger asChild>
                  <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    New Contract
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Contract</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {ncError ? <div className="text-red-600 text-sm">{ncError}</div> : null}
                    <div>
                      <Label htmlFor="contractTitle">Contract Title</Label>
                      <Input id="contractTitle" placeholder="e.g. Electrical Installation Contract" value={ncTitle} onChange={(e) => setNcTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="job">Job</Label>
                        <Select value={ncJobId} onValueChange={setNcJobId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job" />
                          </SelectTrigger>
                          <SelectContent>
                            {(jobs as any[]).map((j) => (
                              <SelectItem key={j.id} value={String(j.id)}>{j.address || `Job ${j.id}`}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contractType">Contract Type</Label>
                        <Select value={ncType} onValueChange={setNcType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Price</SelectItem>
                            <SelectItem value="time">Time & Materials</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subcontractor">Subcontractor</Label>
                        <Select value={ncSubcontractorId} onValueChange={setNcSubcontractorId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcontractor" />
                          </SelectTrigger>
                          <SelectContent>
                            {subcontractors.map((w: any) => (
                              <SelectItem key={w.id} value={String(w.id)}>{w.name || w.username || `#${w.id}`}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={ncCategory} onValueChange={setNcCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electrical">Electrical</SelectItem>
                            <SelectItem value="plumbing">Plumbing</SelectItem>
                            <SelectItem value="hvac">HVAC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Detailed description of work to be performed..." rows={3} value={ncDescription} onChange={(e) => setNcDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="baseAmount">Base Amount ($)</Label>
                        <Input id="baseAmount" type="number" placeholder="0.00" value={ncBaseAmount} onChange={(e) => setNcBaseAmount(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="variations">Variations ($)</Label>
                        <Input id="variations" type="number" placeholder="0.00" value={ncVariations} onChange={(e) => setNcVariations(e.target.value)} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Expected Start Date</Label>
                        <Input id="startDate" type="date" value={ncStartDate} onChange={(e) => setNcStartDate(e.target.value)} />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Expected End Date</Label>
                        <Input id="endDate" type="date" value={ncEndDate} onChange={(e) => setNcEndDate(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowNewContract(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]" disabled={createContract.isPending || !ncTitle || !ncJobId || !ncSubcontractorId} onClick={() => createContract.mutate()}>{createContract.isPending ? 'Creating…' : 'Create Contract'}</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="px-8 py-6 flex-1 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { title: "Total Contracts", value: String(totals.totalContracts), icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
              { title: "Active Contracts", value: String(totals.active), icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
              { title: "Total Value", value: `$${totals.totalValue.toLocaleString()}`, icon: DollarSign, color: "text-purple-600", bgColor: "bg-purple-50" },
              { title: "Total Paid", value: `$${totals.totalPaid.toLocaleString()}`, icon: TrendingUp, color: "text-[#ff622a]", bgColor: "bg-[#fff0ea]" },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4 items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ff622a] w-4 h-4" />
              <Input
                placeholder="Search contracts, jobs, or contractors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600">Showing {filteredContracts.length} contracts</div>
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {filteredContracts.map((contract: any) => (
              <div key={contract.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{contract.contractTitle || contract.title}</h3>
                    <Badge variant="secondary" className="bg-[#fff0ea] text-[#ff622a] border-[#ffd4c5]">
                      {contract.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedContract(contract); setShowContractDetail(true) }}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedContract(contract); setShowEditContract(true) }}>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-[#ff622a] hover:bg-[#fd7d4f]"
                      onClick={() => setShowRecordPayment(true)}
                    >
                      <DollarSign className="w-4 h-4 mr-1" />
                      Record Payment
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Subcontractor</p>
                    <p className="font-medium text-gray-900">{contract.subcontractor?.username || contract.subcontractor || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job</p>
                    <p className="font-medium text-gray-900">{contract.jobId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-gray-900">{contract.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contract Type</p>
                    <p className="font-medium text-gray-900">{contract.contractType}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Base Amount</p>
                    <p className="font-medium text-gray-900">${Number(contract.baseAmount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="font-medium text-gray-900">${(Number(contract.baseAmount || 0) + Number(contract.totalVariations || 0)).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="font-medium text-green-600">${Number(contract.totalPaid || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Outstanding</p>
                    <p className="font-medium text-[#ff622a]">${(Number(contract.baseAmount || 0) + Number(contract.totalVariations || 0) - Number(contract.totalPaid || 0)).toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-sm font-medium text-gray-900">{contract.progress || 0}%</p>
                  </div>
                  <Progress value={contract.progress || 0} className="h-2 [&>div]:bg-[#ff622a]" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Start: {contract.expectedStartDate || contract.startDate || '-'}</span>
                    <span>End: {contract.expectedEndDate || contract.endDate || '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Contract Modal */}
      <Dialog open={showEditContract} onOpenChange={setShowEditContract}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-6">
            <div>
              <Label htmlFor="editContractTitle">Contract Title</Label>
              <Input id="editContractTitle" defaultValue={selectedContract?.contractTitle || selectedContract?.title || ''} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editJob">Job</Label>
                <Select defaultValue={String(selectedContract?.jobId || '')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(selectedContract?.jobId || '')}>{String(selectedContract?.jobId || '')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editContractType">Contract Type</Label>
                <Select defaultValue={String(selectedContract?.contractType || 'fixed')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="time">Time & Materials</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editSubcontractor">Subcontractor</Label>
                <Select defaultValue={String(selectedContract?.subcontractorId || '')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={String(selectedContract?.subcontractorId || '')}>{selectedContract?.subcontractor?.username || 'Subcontractor'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Select defaultValue={String(selectedContract?.category || 'electrical')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                defaultValue={selectedContract?.description || ''}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editBaseAmount">Base Amount ($)</Label>
                <Input id="editBaseAmount" type="number" defaultValue={String(selectedContract?.baseAmount || 0)} />
              </div>
              <div>
                <Label htmlFor="editVariations">Variations ($)</Label>
                <Input id="editVariations" type="number" defaultValue={String(selectedContract?.totalVariations || 0)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStartDate">Expected Start Date</Label>
                <Input id="editStartDate" type="date" defaultValue={String(selectedContract?.expectedStartDate || '').split('T')[0]} />
              </div>
              <div>
                <Label htmlFor="editEndDate">Expected End Date</Label>
                <Input id="editEndDate" type="date" defaultValue={String(selectedContract?.expectedEndDate || '').split('T')[0]} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowEditContract(false)}>
                Cancel
              </Button>
              <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]" onClick={() => {
                if (!selectedContract) return
                const titleEl = document.getElementById('editContractTitle') as HTMLInputElement
                const baseEl = document.getElementById('editBaseAmount') as HTMLInputElement
                const varsEl = document.getElementById('editVariations') as HTMLInputElement
                const descEl = document.getElementById('editDescription') as HTMLTextAreaElement
                updateContract.mutate({ id: selectedContract.id, updates: { contractTitle: titleEl?.value, baseAmount: Number(baseEl?.value||0), totalVariations: Number(varsEl?.value||0), description: descEl?.value } })
              }}>Update Contract</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Detail Modal */}
      <Dialog open={showContractDetail} onOpenChange={setShowContractDetail}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle>{selectedContract?.contractTitle || selectedContract?.title || 'Contract'}</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-4 top-4"
              onClick={() => setShowContractDetail(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 px-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="variations">Variations</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 px-6 pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Base Amount</p>
                  <p className="text-xl font-bold text-gray-900">${Number(selectedContract?.baseAmount || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Variations</p>
                  <p className="text-xl font-bold text-gray-900">${Number(selectedContract?.totalVariations || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">${Number(selectedContract?.totalPaid || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="text-xl font-bold text-[#ff622a]">${(Number(selectedContract?.baseAmount || 0) + Number(selectedContract?.totalVariations || 0) - Number(selectedContract?.totalPaid || 0)).toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">Payment Progress</p>
                  <p className="text-sm font-medium text-gray-900">{selectedContract?.progress || 0}% Complete</p>
                </div>
                <Progress value={selectedContract?.progress || 0} className="h-3 [&>div]:bg-[#ff622a]" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Job Location</p>
                  <p className="font-medium text-gray-900">{selectedContract?.jobId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Date</p>
                  <p className="font-medium text-gray-900">{selectedContract?.contractDate || '-'}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="payments" className="space-y-6 px-6 pb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Payment History</h3>
                <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]" onClick={() => setShowRecordPayment(true)}>
                  Record Payment
                </Button>
              </div>
              <div className="text-center py-12 text-gray-500">No payments recorded yet</div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Record Payment Modal */}
      <Dialog open={showRecordPayment} onOpenChange={setShowRecordPayment}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 px-6 pb-6">
            <div>
              <Label htmlFor="paymentAmount">Payment Amount ($)</Label>
              <Input id="paymentAmount" type="number" placeholder="0.00" />
            </div>
            <div>
              <Label htmlFor="paymentDate">Payment Date</Label>
              <Input id="paymentDate" type="date" />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentNotes">Notes (Optional)</Label>
              <Textarea id="paymentNotes" placeholder="Payment notes..." rows={3} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowRecordPayment(false)}>
                Cancel
              </Button>
              <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]">Record Payment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
