"use client"

import { useState } from "react"
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

export default function SubcontractorsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [showAddSubcontractor, setShowAddSubcontractor] = useState(false)
  const [showNewContract, setShowNewContract] = useState(false)
  const [showEditContract, setShowEditContract] = useState(false)
  const [showContractDetail, setShowContractDetail] = useState(false)
  const [showRecordPayment, setShowRecordPayment] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const contracts = [
    {
      id: 1,
      title: "Electrical Installation - Kitchen Renovation",
      subcontractor: "ABC Electrical Services",
      job: "test123",
      category: "Electrical",
      contractType: "Fixed Price",
      baseAmount: 5000,
      totalValue: 5500,
      totalPaid: 2000,
      outstanding: 3500,
      progress: 36,
      status: "In Progress",
      startDate: "1/15/2025",
      endDate: "2/15/2025",
      description:
        "Complete electrical installation for kitchen renovation including new circuits, outlets, and lighting fixtures.",
    },
    {
      id: 2,
      title: "Bathroom Plumbing Upgrade",
      subcontractor: "Premier Plumbing Co",
      job: "test123",
      category: "Plumbing",
      contractType: "Time & Materials",
      baseAmount: 3000,
      totalValue: 3000,
      totalPaid: 1500,
      outstanding: 1500,
      progress: 50,
      status: "In Progress",
      startDate: "1/20/2025",
      endDate: "2/10/2025",
    },
  ]

  const stats = [
    { title: "Total Contracts", value: "2", icon: FileText, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Contracts", value: "2", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Total Value", value: "$8,500", icon: DollarSign, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Total Paid", value: "$3,500", icon: TrendingUp, color: "text-[#ff622a]", bgColor: "bg-[#fff0ea]" },
  ]

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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" placeholder="ABC Construction Ltd" />
                      </div>
                      <div>
                        <Label htmlFor="specialty">Specialty</Label>
                        <Select>
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
                        <Input id="email" type="email" placeholder="contact@company.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="021-555-0123" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="123 Main Street, Auckland" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="license">License Number</Label>
                        <Input id="license" placeholder="LIC123456" />
                      </div>
                      <div>
                        <Label htmlFor="insurance">Insurance Expiry</Label>
                        <Input id="insurance" type="date" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowAddSubcontractor(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]">Add Subcontractor</Button>
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
                    <div>
                      <Label htmlFor="contractTitle">Contract Title</Label>
                      <Input id="contractTitle" placeholder="e.g. Electrical Installation Contract" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="job">Job</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="test123">test123</SelectItem>
                            <SelectItem value="project456">project456</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contractType">Contract Type</Label>
                        <Select>
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
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subcontractor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="abc">ABC Electrical Services</SelectItem>
                            <SelectItem value="premier">Premier Plumbing Co</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select>
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
                      <Textarea
                        id="description"
                        placeholder="Detailed description of work to be performed..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="baseAmount">Base Amount ($)</Label>
                        <Input id="baseAmount" type="number" placeholder="0.00" />
                      </div>
                      <div>
                        <Label htmlFor="variations">Variations ($)</Label>
                        <Input id="variations" type="number" placeholder="0.00" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Expected Start Date</Label>
                        <Input id="startDate" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Expected End Date</Label>
                        <Input id="endDate" type="date" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setShowNewContract(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]">Create Contract</Button>
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
            {stats.map((stat, index) => (
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
            <div className="text-sm text-gray-600">Showing {contracts.length} contracts</div>
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {contracts.map((contract) => (
              <div key={contract.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">{contract.title}</h3>
                    <Badge variant="secondary" className="bg-[#fff0ea] text-[#ff622a] border-[#ffd4c5]">
                      {contract.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowContractDetail(true)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowEditContract(true)}>
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
                    <p className="font-medium text-gray-900">{contract.subcontractor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Job</p>
                    <p className="font-medium text-gray-900">{contract.job}</p>
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
                    <p className="font-medium text-gray-900">${contract.baseAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="font-medium text-gray-900">${contract.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="font-medium text-green-600">${contract.totalPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Outstanding</p>
                    <p className="font-medium text-[#ff622a]">${contract.outstanding.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="text-sm font-medium text-gray-900">{contract.progress}%</p>
                  </div>
                  <Progress value={contract.progress} className="h-2 [&>div]:bg-[#ff622a]" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Start: {contract.startDate}</span>
                    <span>End: {contract.endDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Contract Modal */}
      <Dialog open={showEditContract} onOpenChange={setShowEditContract}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editContractTitle">Contract Title</Label>
              <Input id="editContractTitle" defaultValue="Electrical Installation - Kitchen Renovation" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editJob">Job</Label>
                <Select defaultValue="test123">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test123">test123</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editContractType">Contract Type</Label>
                <Select defaultValue="fixed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editSubcontractor">Subcontractor</Label>
                <Select defaultValue="abc">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abc">ABC Electrical Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Select defaultValue="electrical">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electrical">Electrical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                defaultValue="Complete electrical installation for kitchen renovation including new circuits, outlets, and lighting fixtures."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editBaseAmount">Base Amount ($)</Label>
                <Input id="editBaseAmount" type="number" defaultValue="5000" />
              </div>
              <div>
                <Label htmlFor="editVariations">Variations ($)</Label>
                <Input id="editVariations" type="number" defaultValue="500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editStartDate">Expected Start Date</Label>
                <Input id="editStartDate" type="date" defaultValue="2025-01-15" />
              </div>
              <div>
                <Label htmlFor="editEndDate">Expected End Date</Label>
                <Input id="editEndDate" type="date" defaultValue="2025-02-15" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEditContract(false)}>
                Cancel
              </Button>
              <Button className="bg-[#ff622a] hover:bg-[#fd7d4f]">Update Contract</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contract Detail Modal */}
      <Dialog open={showContractDetail} onOpenChange={setShowContractDetail}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Electrical Installation - Kitchen Renovation</DialogTitle>
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="variations">Variations</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Base Amount</p>
                  <p className="text-xl font-bold text-gray-900">$5,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Variations</p>
                  <p className="text-xl font-bold text-gray-900">$500</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-xl font-bold text-green-600">$2,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="text-xl font-bold text-[#ff622a]">$3,500</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-900">Payment Progress</p>
                  <p className="text-sm font-medium text-gray-900">36% Complete</p>
                </div>
                <Progress value={36} className="h-3 [&>div]:bg-[#ff622a]" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">Job Location</p>
                  <p className="font-medium text-gray-900">test123</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contract Date</p>
                  <p className="font-medium text-gray-900">1/15/2025</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="payments" className="space-y-6">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
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
            <div className="flex justify-end gap-3 pt-4">
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
