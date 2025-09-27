"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { FileText, Download, Eye, Trash2 } from "lucide-react"

export default function ReportsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const reports = [
    {
      id: 1,
      title: "Financial Report - office-renovation",
      project: "office-renovation",
      generated: "2025-03-23",
      author: "flutterflow",
      size: "3.1 MB",
      status: "Ready",
    },
    {
      id: 2,
      title: "Project Progress Report - test123",
      project: "test123",
      generated: "2025-01-16",
      author: "flutterflow",
      size: "2.4 MB",
      status: "Ready",
    },
    {
      id: 3,
      title: "Financial Summary - Office Renovation",
      project: "test123",
      generated: "2025-01-16",
      author: "flutterflow",
      size: "2.4 MB",
      status: "Ready",
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />

      <div className={`flex-1 transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        <div className="p-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Reports</h1>
            <p className="text-gray-500">Generate comprehensive construction reports with intelligent insights</p>
          </div>

          {/* Generate New Reports Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New Reports</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Select Project</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff622a] focus:border-transparent text-gray-500">
                  <option>Choose a project</option>
                  <option>Office Renovation</option>
                  <option>Test123</option>
                  <option>Residential Build</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Report Type</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff622a] focus:border-transparent text-gray-500">
                  <option>Choose report type</option>
                  <option>Financial Report</option>
                  <option>Progress Report</option>
                  <option>Safety Report</option>
                  <option>Summary Report</option>
                </select>
              </div>
            </div>

            <Button className="w-full bg-[#ff622a] hover:bg-[#e55a26] text-white py-3 text-base font-medium">
              <FileText className="w-5 h-5 mr-2" />
              Generate Report
            </Button>
          </div>

          {/* Generated Reports Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#ff622a] rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Generated Reports</h2>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                {reports.length} Reports
              </span>
            </div>

            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <span className="bg-[#ff622a] text-white px-2 py-1 rounded-full text-xs font-medium">
                          {report.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Project: {report.project} • Generated: {report.generated} • By: {report.author} • Size:{" "}
                        {report.size}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 bg-transparent">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 bg-transparent">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
