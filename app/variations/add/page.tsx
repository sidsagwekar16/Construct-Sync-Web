import {
  Bell,
  Calendar,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  Shield,
  Clock,
  Home,
  Map,
  Briefcase,
  ChevronLeft,
  ArrowLeft,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function AddVariantPage() {
  const navigationItems = [
    { icon: Home, label: "Dashboard", active: false, href: "/dashboard" },
    { icon: Briefcase, label: "Jobs", active: false, href: "/" },
    { icon: Calendar, label: "Timeline", active: false, href: "/timeline" },
    { icon: Map, label: "Maps", active: false, href: "/maps" },
    { icon: Clock, label: "Timesheet", active: false, href: "/timesheet" },
    { icon: DollarSign, label: "Budget", active: false, href: "/budget" },
    { icon: FileText, label: "Variations", active: true, href: "/variations" },
    { icon: Users, label: "Workers", active: false, href: "/workers" },
    { icon: Users, label: "Subcontractors", active: false, href: "/subcontractors" },
    { icon: Shield, label: "Safety", active: false, href: "/safety" },
    { icon: BarChart3, label: "Analytics", active: false, href: "/analytics" },
  ]

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      {/* Sidebar */}
      <div className="w-80 bg-[#192d47] text-white flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ff622a] rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <div className="font-bold text-lg">CONSTRUCT</div>
              <div className="font-bold text-lg -mt-1">SYNC</div>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          {navigationItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 cursor-pointer transition-colors ${
                  item.active ? "bg-[#ff622a] text-white" : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-600">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 cursor-pointer">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/professional-headshot.png" />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium">Praneeth</div>
              <div className="text-sm text-gray-400">praneeth@constructsync.com</div>
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400 rotate-180" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Variations</h1>
              <p className="text-gray-500 mt-1">
                Track contract changes, work requests & project modifications that affect scope or cost.
              </p>
            </div>
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-8 py-6 overflow-auto">
          {/* Back Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link href="/variations">
                <ArrowLeft className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
              </Link>
              <h2 className="text-xl font-bold text-gray-900">Variation Details</h2>
            </div>
            <Link href="/variations">
              <X className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            </Link>
          </div>

          {/* Add Variant Form */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                  <Input
                    placeholder="Enter Variation Title"
                    className="border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                  <Textarea
                    placeholder="Describe the variation details"
                    rows={4}
                    className="border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                  />
                </div>

                {/* Job Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Job Address</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#ff622a] focus:ring-[#ff622a] focus:outline-none text-gray-500">
                    <option>Select Job Address</option>
                    <option>123 Main Street, City A</option>
                    <option>456 Oak Avenue, City B</option>
                  </select>
                </div>

                {/* Three column row */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Variation Type</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#ff622a] focus:ring-[#ff622a] focus:outline-none">
                      <option>Client Requested</option>
                      <option>Design Change</option>
                      <option>Site Condition</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#ff622a] focus:ring-[#ff622a] focus:outline-none">
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Priority</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#ff622a] focus:ring-[#ff622a] focus:outline-none">
                      <option>Medium</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                {/* Two column row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Assigned To</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#ff622a] focus:ring-[#ff622a] focus:outline-none text-gray-500">
                      <option>Select Worker</option>
                      <option>John Smith</option>
                      <option>Jane Doe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Linked Contract</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#ff622a] focus:ring-[#ff622a] focus:outline-none text-gray-500">
                      <option>Select Contract</option>
                      <option>Contract A</option>
                      <option>Contract B</option>
                    </select>
                  </div>
                </div>

                {/* Financial Information Section */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>

                  {/* Pricing Model */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Pricing Model</label>
                    <Input
                      placeholder="Fixed Price"
                      className="border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                    />
                  </div>

                  {/* Cost fields */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Subcontractor cost ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-8 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Labor cost ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-8 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Materials Profit Tracking Section */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Materials Profit Tracking</h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Materials Amount ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-8 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">What you charge for the client</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Materials Cost ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-8 border-gray-300 focus:border-[#ff622a] focus:ring-[#ff622a]"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">What you pay for materials</p>
                    </div>
                  </div>

                  {/* Profit and Margin Display */}
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Materials Profit:</span>
                      <span className="text-green-600 font-semibold">$0.00</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Margin:</span>
                      <span className="text-green-600 font-semibold">0.0%</span>
                    </div>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex flex-wrap gap-6 pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="chargeable" />
                    <label htmlFor="chargeable" className="text-sm font-medium text-gray-900">
                      Chargeable to Client
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="subcontractor" />
                    <label htmlFor="subcontractor" className="text-sm font-medium text-gray-900">
                      Requires Subcontractor
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="approval" />
                    <label htmlFor="approval" className="text-sm font-medium text-gray-900">
                      Client Approval Required
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6">
                  <Link href="/variations">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                      Cancel
                    </Button>
                  </Link>
                  <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">Create Variation</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
