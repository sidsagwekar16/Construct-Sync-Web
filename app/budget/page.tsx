"use client"

import { useState } from "react"
import { Bell, Download, TrendingUp, TrendingDown, DollarSign, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import SharedSidebar from "@/components/shared-sidebar"

export default function BudgetPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  // Budget data
  const budgetData = {
    originalBudget: 500000,
    variations: 25000,
    adjusted: 525000,
    actualSpend: 400000,
    remaining: 125000,
  }

  const budgetUsagePercent = (budgetData.actualSpend / budgetData.adjusted) * 100

  // Category breakdown data
  const categories = [
    {
      name: "Labor",
      percentage: 90.0,
      spent: 180000,
      allocated: 200000,
      remaining: 20000,
    },
    {
      name: "Materials",
      percentage: 80.0,
      spent: 120000,
      allocated: 150000,
      remaining: 30000,
    },
    {
      name: "Subcontractors",
      percentage: 85.0,
      spent: 85000,
      allocated: 100000,
      remaining: 15000,
    },
    {
      name: "Variations",
      percentage: 30.0,
      spent: 15000,
      allocated: 50000,
      remaining: 35000,
    },
  ]

  // Materials data
  const materials = [
    {
      item: "Drywall Sheets",
      quantity: 150,
      unitCost: 25.0,
      total: 3750,
      supplier: "BuildMart",
      date: "8/10/2025",
    },
    {
      item: "Paint (Premium)",
      quantity: 50,
      unitCost: 45.0,
      total: 2250,
      supplier: "ColorPro",
      date: "8/12/2025",
    },
    {
      item: "Electrical Wiring",
      quantity: 500,
      unitCost: 3.5,
      total: 1750,
      supplier: "ElectroSupply",
      date: "8/15/2025",
    },
  ]

  const totalMaterialCost = materials.reduce((sum, item) => sum + item.total, 0)

  // Variations data
  const variations = [
    {
      title: "Additional electrical work for kitchen",
      requestedBy: "Jefferson Pan",
      date: "8/15/2025",
      amount: 15000,
      status: "approved",
    },
    {
      title: "Upgrade to premium flooring",
      requestedBy: "flutterflow",
      date: "8/20/2025",
      amount: 10000,
      status: "pending",
    },
  ]

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        {/* Header */}
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#232323]">Budget</h1>
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
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#232323]">Budget Management</h2>
              <p className="text-gray-500 text-sm mt-1">Track project costs and manage budget allocations</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff622a] focus:border-[#ff622a]">
                <option>Downtown Office - Site...</option>
              </select>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300 text-gray-700 bg-transparent"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Original Budget</span>
                </div>
                <div className="text-2xl font-bold text-[#232323]">${budgetData.originalBudget.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Variations</span>
                </div>
                <div className="text-2xl font-bold text-[#00bcff]">+${budgetData.variations.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Adjusted</span>
                </div>
                <div className="text-2xl font-bold text-[#232323]">${budgetData.adjusted.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-[#ff622a]" />
                  <span className="text-sm text-gray-600">Actual Spend</span>
                </div>
                <div className="text-2xl font-bold text-[#ff622a]">${budgetData.actualSpend.toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#2cb854]" />
                  <span className="text-sm text-gray-600">Remaining</span>
                </div>
                <div className="text-2xl font-bold text-[#2cb854]">${budgetData.remaining.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Usage */}
          <Card className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#232323]">Budget Usage</h3>
                <span className="text-sm font-medium text-gray-600">{budgetUsagePercent.toFixed(1)}% Used</span>
              </div>
              <Progress value={budgetUsagePercent} className="h-2 bg-gray-200" />
              <p className="text-sm text-gray-500 mt-2">
                ${budgetData.actualSpend.toLocaleString()} of ${budgetData.adjusted.toLocaleString()} spent
              </p>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 mb-6 gap-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#232323] data-[state=active]:border-b-2 data-[state=active]:border-[#232323] data-[state=active]:shadow-none rounded-none px-6 py-3 text-gray-500 border-b-2 border-transparent font-normal"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#232323] data-[state=active]:border-b-2 data-[state=active]:border-[#232323] data-[state=active]:shadow-none rounded-none px-6 py-3 text-gray-500 border-b-2 border-transparent font-normal"
              >
                Materials
              </TabsTrigger>
              <TabsTrigger
                value="variations"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#232323] data-[state=active]:border-b-2 data-[state=active]:border-[#232323] data-[state=active]:shadow-none rounded-none px-6 py-3 text-gray-500 border-b-2 border-transparent font-normal"
              >
                Variations
              </TabsTrigger>
              <TabsTrigger
                value="labor"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#232323] data-[state=active]:border-b-2 data-[state=active]:border-[#232323] data-[state=active]:shadow-none rounded-none px-6 py-3 text-gray-500 border-b-2 border-transparent font-normal"
              >
                Labor
              </TabsTrigger>
              <TabsTrigger
                value="subcontractors"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#232323] data-[state=active]:border-b-2 data-[state=active]:border-[#232323] data-[state=active]:shadow-none rounded-none px-6 py-3 text-gray-500 border-b-2 border-transparent font-normal"
              >
                Subcontractors
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-[#232323] mb-6">Budget by Category</h3>
                  <div className="space-y-6">
                    {categories.map((category, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-[#232323]">{category.name}</span>
                            <span className="text-sm font-medium text-gray-600">{category.percentage}%</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            ${category.spent.toLocaleString()} / ${category.allocated.toLocaleString()}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all`}
                              style={{
                                width: `${category.percentage}%`,
                                backgroundColor:
                                  category.name === "Labor"
                                    ? "#ff4a44"
                                    : category.name === "Variations"
                                      ? "#00bcff"
                                      : "#ff622a",
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Remaining: ${category.remaining.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-[#232323]">Labor Summary</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Allocated</span>
                        <span className="font-medium text-[#232323]">$200,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Actual</span>
                        <span className="font-medium text-[#ff622a]">$180,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Variance</span>
                        <span className="font-medium text-[#2cb854]">$20,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-gray-500" />
                      <h3 className="font-semibold text-[#232323]">Subcontractor Summary</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Allocated</span>
                        <span className="font-medium text-[#232323]">$100,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Actual</span>
                        <span className="font-medium text-[#ff622a]">$85,000</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Variance</span>
                        <span className="font-medium text-[#2cb854]">$15,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Materials Tab */}
            <TabsContent value="materials" className="mt-0">
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[#232323]">Material Tracking</h3>
                    <Button className="bg-[#232323] hover:bg-[#000000] text-white">+ Add Material</Button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Item</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Quantity</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Unit Cost</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Supplier</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materials.map((material, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-4 px-4 text-sm text-[#232323]">{material.item}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">{material.quantity}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">${material.unitCost.toFixed(2)}</td>
                            <td className="py-4 px-4 text-sm font-medium text-[#232323]">
                              ${material.total.toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">{material.supplier}</td>
                            <td className="py-4 px-4 text-sm text-gray-600">{material.date}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan={3} className="py-4 px-4 text-sm font-semibold text-[#232323]">
                            Total Material Cost
                          </td>
                          <td className="py-4 px-4 text-sm font-bold text-[#ff622a]">
                            ${totalMaterialCost.toLocaleString()}
                          </td>
                          <td colSpan={2}></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Variations Tab */}
            <TabsContent value="variations" className="mt-0">
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[#232323]">Variations (Change Orders)</h3>
                    <Button className="bg-[#232323] hover:bg-[#000000] text-white">+ Add Variation</Button>
                  </div>

                  <div className="space-y-4">
                    {variations.map((variation, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-[#232323]">{variation.title}</h4>
                              <Badge
                                className={
                                  variation.status === "approved"
                                    ? "bg-[#232323] text-white hover:bg-[#000000]"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }
                              >
                                {variation.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Requested by: {variation.requestedBy} Date: {variation.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-[#232323] mb-2">
                              ${variation.amount.toLocaleString()}
                            </div>
                            {variation.status === "pending" && (
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="bg-[#2cb854] hover:bg-[#28a100] text-white text-xs">
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-[#ff4a44] text-[#ff4a44] hover:bg-[#ff4a44] hover:text-white text-xs bg-transparent"
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Labor Tab */}
            <TabsContent value="labor" className="mt-0">
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold text-[#232323]">Labor Costs (Auto-calculated from Timesheets)</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Allocated Budget</p>
                      <p className="text-2xl font-bold text-[#232323]">$200,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Actual Spend</p>
                      <p className="text-2xl font-bold text-[#ff622a]">$180,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Variance</p>
                      <p className="text-2xl font-bold text-[#2cb854]">$20,000</p>
                    </div>
                  </div>

                  <Button variant="link" className="text-[#232323] p-0 h-auto font-normal">
                    View Detailed Timesheet Breakdown
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Subcontractors Tab */}
            <TabsContent value="subcontractors" className="mt-0">
              <Card className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-gray-500" />
                    <h3 className="font-semibold text-[#232323]">Subcontractor Costs</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Allocated Budget</p>
                      <p className="text-2xl font-bold text-[#232323]">$100,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Actual Spend</p>
                      <p className="text-2xl font-bold text-[#ff622a]">$85,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Variance</p>
                      <p className="text-2xl font-bold text-[#2cb854]">$15,000</p>
                    </div>
                  </div>

                  <Button variant="link" className="text-[#232323] p-0 h-auto font-normal">
                    View Contract & Invoice Details
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
