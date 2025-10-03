"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { SharedHeader } from "@/components/shared-header"
import {
  Building2,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Award,
  AlertCircle,
  Info,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function AnalyticsPage() {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("site-overview")

  const tabs = [
    { id: "site-overview", label: "Site Overview", icon: Building2 },
    { id: "job-profitability", label: "Job Profitability", icon: DollarSign },
    { id: "labor-efficiency", label: "Labor Efficiency", icon: Users },
    { id: "business-health", label: "Business Health", icon: Activity },
    { id: "project-analytics", label: "Project Analytics", icon: BarChart3 },
    { id: "future-planning", label: "Future Planning", icon: TrendingUp },
    { id: "action-plan", label: "Action Plan", icon: Target },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <SharedSidebar onMinimizeChange={setIsSidebarMinimized} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarMinimized ? "ml-20" : "ml-80"}`}>
        <SharedHeader title="AI Analytics" />

        <main className="flex-1 overflow-auto p-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-[#ff622a]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Construction Intelligence Hub</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time business insights from your project data • 0h tracked across 2 active sites
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-4 px-1 border-b-2 transition-colors relative ${
                    activeTab === tab.id
                      ? "border-[#ff622a] text-[#ff622a]"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "site-overview" && <SiteOverviewTab />}
          {activeTab === "job-profitability" && <JobProfitabilityTab />}
          {activeTab === "labor-efficiency" && <LaborEfficiencyTab />}
          {activeTab === "business-health" && <BusinessHealthTab />}
          {activeTab === "project-analytics" && <ProjectAnalyticsTab />}
          {activeTab === "future-planning" && <FuturePlanningTab />}
          {activeTab === "action-plan" && <ActionPlanTab />}
        </main>
      </div>
    </div>
  )
}

// Site Overview Tab
function SiteOverviewTab() {
  return (
    <div className="space-y-6">
      {/* Dark Dashboard Section */}
      <div className="bg-[#2c3e50] rounded-lg p-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Construction Business Dashboard</h2>
            <p className="text-sm text-gray-300 mt-1">
              Real-time insights from your construction projects • AI-powered analysis of all job sites
            </p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-[#34495e] rounded-lg p-4">
            <div className="text-3xl font-bold text-yellow-400 mb-1">0.0%</div>
            <div className="text-sm text-gray-300">Profit Margin</div>
            <div className="text-xs text-gray-400 mt-1">Target: 10-15%</div>
          </div>
          <div className="bg-[#34495e] rounded-lg p-4">
            <div className="text-3xl font-bold text-green-400 mb-1">$0</div>
            <div className="text-sm text-gray-300">Net Profit</div>
            <div className="text-xs text-gray-400 mt-1">All Projects</div>
          </div>
          <div className="bg-[#34495e] rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-400 mb-1">0.0h</div>
            <div className="text-sm text-gray-300">Labor Hours</div>
            <div className="text-xs text-gray-400 mt-1">All Sites</div>
          </div>
          <div className="bg-[#34495e] rounded-lg p-4">
            <div className="text-3xl font-bold text-orange-400 mb-1">1</div>
            <div className="text-sm text-gray-300">Variations</div>
            <div className="text-xs text-gray-400 mt-1">Change Orders</div>
          </div>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Profit Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Profit Analysis</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Revenue</span>
              <span className="font-semibold text-green-600">$1,355</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Expenses</span>
              <span className="font-semibold text-red-600">$1,355</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t">
              <span className="text-gray-900 font-semibold">Net Profit</span>
              <span className="font-bold">$0</span>
            </div>
            <Progress value={0} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-red-600">
              <AlertTriangle className="w-3 h-3" />
              <span>Needs Improvement</span>
            </div>
          </div>
        </div>

        {/* Advanced Analytics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Advanced Analytics</h3>
          </div>
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(85 / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">85%</span>
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 mb-3">Business Health Score</div>
            <div className="space-y-2 w-full text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Efficiency</span>
                <span className="font-semibold">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Growth</span>
                <span className="font-semibold">92%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Risk Level</span>
                <span className="font-semibold text-yellow-600">Medium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Predictive Intelligence */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Predictive Intelligence</h3>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">94%</div>
              <div className="text-xs text-gray-600">Forecast Accuracy</div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-3 h-3 text-green-600" />
                <span className="text-gray-600">Revenue projected +15%</span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-3 h-3 text-red-600" />
                <span className="text-gray-600">Costs optimizable -12%</span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-3 h-3 text-blue-600" />
                <span className="text-gray-600">3-month outlook strong</span>
              </div>
            </div>
            <Progress value={94} className="h-2" />
          </div>
        </div>

        {/* Action Plan */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Action Plan</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">3</span>
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Quick Wins</span>
              <span>Major Projects</span>
            </div>
            <div className="space-y-2 pt-3 border-t text-xs">
              <div className="text-gray-900 font-medium">Process Improvements</div>
              <div className="text-gray-600">4 pending</div>
              <div className="text-gray-900 font-medium">Cost Reductions</div>
              <div className="text-gray-600">$30k/year</div>
              <div className="text-gray-900 font-medium">Revenue Optimization</div>
              <div className="text-green-600 font-semibold">+18% potential</div>
            </div>
          </div>
        </div>
      </div>

      {/* Consolidated Business Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Consolidated Business Performance Overview</h3>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Key Performance Metrics</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Profit Margin</span>
                  <span className="text-gray-900 font-medium">0% / 12%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={0} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500">Current: 0%</span>
                  <span className="text-xs text-gray-500">Target: 12%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Efficiency Score</span>
                  <span className="text-gray-900 font-medium">78% / 90%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={78} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500">Current: 78%</span>
                  <span className="text-xs text-gray-500">Target: 90%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Resource Utilization</span>
                  <span className="text-gray-900 font-medium">74% / 85%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={74} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500">Current: 74%</span>
                  <span className="text-xs text-gray-500">Target: 85%</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Quality Score</span>
                  <span className="text-gray-900 font-medium">94% / 95%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={94} className="flex-1 h-2" />
                  <span className="text-xs text-gray-500">Current: 94%</span>
                  <span className="text-xs text-gray-500">Target: 95%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">AI-Generated Insights from Real Data</h4>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-yellow-900 mb-1">Top Opportunity</div>
                    <div className="text-xs text-yellow-800">
                      Improve profit margin from 0.0% to 10%+ target ($355 potential gain)
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-blue-900 mb-1">Growth Potential</div>
                    <div className="text-xs text-blue-800">
                      Expand project pipeline - current 1K revenue shows 50%+ growth potential
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-orange-900 mb-1">Risk Alert</div>
                    <div className="text-xs text-orange-800">
                      Monitor project delivery schedules - 1 active projects require attention
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-green-900 mb-1">Profitable Operations</div>
                    <div className="text-xs text-green-800">
                      Current margin: 0.0% (positive) - maintain cost controls
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-2">Deep Dive Analysis</h3>
        <p className="text-sm text-gray-600 mb-6">Click any area below to explore detailed AI insights</p>

        <div className="grid grid-cols-6 gap-4">
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-medium">Profit Analysis</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-medium">Efficiency</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
            <Activity className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-medium">Business Health</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
            <Zap className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-medium">Advanced Analytics</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-medium">Predictions</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 bg-transparent">
            <Target className="w-5 h-5 text-gray-600" />
            <span className="text-xs font-medium">Action Plan</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

// Job Profitability Tab
function JobProfitabilityTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Current Profit Margin</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">0.0%</div>
          <div className="text-sm text-gray-600 mb-4">Professional Target: 15%</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: "0%" }}></div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Total Investment</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">$1,355</div>
          <div className="text-sm text-gray-600 mb-4">Across 2 active projects</div>
          <div className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
            1 Variations
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-600">Total Hours Logged</span>
          </div>
          <div className="text-4xl font-bold text-gray-900 mb-2">0h</div>
          <div className="text-sm text-gray-600 mb-4">Real timesheet data</div>
          <div className="inline-block bg-black text-white text-xs font-medium px-2 py-1 rounded">Active Tracking</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <Award className="w-10 h-10 text-yellow-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Business Intelligence</h3>
        <p className="text-gray-600">Waiting for project data to load...</p>
      </div>
    </div>
  )
}

// Labor Efficiency Tab
function LaborEfficiencyTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Hour Utilization</span>
          </div>
          <div className="text-4xl font-bold text-blue-900 mb-2">0%</div>
          <div className="text-sm text-blue-700 mb-1">Based on 0.0h logged</div>
          <div className="text-xs text-blue-600">Target: 80-90%</div>
        </div>

        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Cost Efficiency</span>
          </div>
          <div className="text-4xl font-bold text-green-900 mb-2">$0</div>
          <div className="text-sm text-green-700 mb-2">Cost per hour</div>
          <div className="inline-block bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">Efficient</div>
        </div>

        <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Revenue Efficiency</span>
          </div>
          <div className="text-4xl font-bold text-purple-900 mb-2">$0</div>
          <div className="text-sm text-purple-700 mb-1">Revenue per hour</div>
          <div className="text-xs text-purple-600">Target: $400-500/hr</div>
        </div>

        <div className="bg-orange-50 rounded-lg border border-orange-200 p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Productivity Score</span>
          </div>
          <div className="text-4xl font-bold text-orange-900 mb-2">0</div>
          <div className="text-sm text-orange-700 mb-2">Efficiency rating</div>
          <div className="inline-block bg-orange-600 text-white text-xs font-medium px-2 py-1 rounded">Improve</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Labor Distribution & Efficiency Analysis</h3>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Resource Allocation Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-900">Direct Labor</div>
                  <div className="text-xs text-gray-600">Efficiency: NaN% • Cost/hr: $NaN</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">0.0h | $0</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-900">Subcontractor Work</div>
                  <div className="text-xs text-gray-600">Efficiency: 0% • Cost/hr: $infinity</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">0.0h | $1,232</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-gray-900">Admin/Overhead</div>
                  <div className="text-xs text-gray-600">Efficiency: NaN% • Cost/hr: $NaN</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">0.0h | $0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Performance Insights</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-green-900 mb-1">Efficiency Strength</div>
                <div className="text-xs text-green-800">
                  High activity levels with 0.0 hours logged across 2 projects
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-blue-900 mb-1">Performance Metrics</div>
                <div className="text-xs text-blue-800">
                  • Average 0.0h per active job
                  <br />• 3 documented time entries
                  <br />• 1 project variations managed
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-yellow-900 mb-1">Optimization Opportunities</div>
                <div className="text-xs text-yellow-800">
                  Focus on reducing cost per hour from $0 to target of $200/hr
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Efficiency Improvement Action Plan</h3>
        </div>
        <p className="text-sm text-gray-600">Recommendations will appear here based on your project data.</p>
      </div>
    </div>
  )
}

// Business Health Tab
function BusinessHealthTab() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Activity className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Overall Business Health Score</h3>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#8b5cf6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(43 / 100) * 351.68} 351.68`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">43</span>
                <span className="text-xs text-gray-600">Health Score</span>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-orange-900 mb-1">Requires Attention</div>
                  <div className="text-sm text-orange-800 mb-2">Based on profit, efficiency, and growth metrics</div>
                  <div className="text-xs text-orange-700">Target: 80+ for top 5% performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-600" />
            <span className="text-sm font-semibold text-red-900">Profit Health</span>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#fee2e2" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#dc2626"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(25 / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">25</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">0.0%</div>
            <div className="text-sm text-gray-600 mb-1">Current Margin</div>
            <div className="text-xs text-gray-500">Target: 10-15%</div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Efficiency Health</span>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#dbeafe" strokeWidth="8" fill="none" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#2563eb"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(100 / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">100</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">0h</div>
            <div className="text-sm text-gray-600 mb-1">Hours Logged</div>
            <div className="text-xs text-gray-500">Across 2 projects</div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg border border-green-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-900">Growth Health</span>
          </div>
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 mb-3 flex items-center justify-center">
              <div className="text-5xl font-bold text-green-600">3</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">$1K</div>
            <div className="text-sm text-gray-600 mb-1">Revenue</div>
            <div className="text-xs text-gray-500">Target: $30K+/month</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Professional Construction Business Analysis</h3>
        </div>
        <p className="text-sm text-gray-600 mb-6">Performance vs Industry Standards</p>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Profit Margin</span>
                <span className="text-gray-900 font-medium">0.0% vs 10-15% target</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Project Delivery</span>
                <span className="text-gray-900 font-medium">2 active projects</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </div>

          <div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-green-900 mb-1">Profitable Operations</div>
                  <div className="text-xs text-green-800">Current margin: 0.0% (positive)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Project Analytics Tab
function ProjectAnalyticsTab() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
      <BarChart3 className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Analytics</h3>
      <p className="text-gray-600">Detailed project analytics will appear here</p>
    </div>
  )
}

// Future Planning Tab
function FuturePlanningTab() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
      <TrendingUp className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Future Planning</h3>
      <p className="text-gray-600">AI-powered forecasting and planning tools coming soon</p>
    </div>
  )
}

// Action Plan Tab
function ActionPlanTab() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
      <Target className="w-16 h-16 text-gray-400 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Action Plan</h3>
      <p className="text-gray-600">Personalized action items and recommendations will appear here</p>
    </div>
  )
}
