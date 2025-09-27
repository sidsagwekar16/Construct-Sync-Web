"use client"

import { SharedSidebar } from "@/components/shared-sidebar"
import { useState } from "react"

export default function TeamsPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const teams = [
    {
      id: 1,
      name: "Alpha Team",
      description: "Main Construction Crew",
      status: "ACTIVE",
      avatar: "A",
      teamLeader: "flutterflow",
      members: ["flutterflow", "Jeff"],
      specialities: ["GENERAL CONSTRUCTION", "RENOVATION"],
    },
    {
      id: 2,
      name: "Beta Team",
      description: "Specialized Finishing Crew",
      status: "ACTIVE",
      avatar: "B",
      teamLeader: "Jefferson Pan",
      members: ["Jefferson Pan", "Sid"],
      specialities: ["FINISHING", "ELECTRICAL", "PLUMBING"],
    },
  ]

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
            <button className="bg-[#ff622a] hover:bg-[#e55520] text-white px-6 py-3 rounded-lg font-medium transition-colors">
              + Create Team
            </button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Team Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#ff622a]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#ff622a] font-bold text-lg">{team.avatar}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{team.name}</h3>
                      <p className="text-gray-600 text-sm">{team.description}</p>
                    </div>
                  </div>
                  <span className="bg-[#ff622a] text-white px-3 py-1 rounded-full text-xs font-medium">
                    {team.status}
                  </span>
                </div>

                {/* Team Leader */}
                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-2">Team Leader</p>
                  <p className="font-semibold text-gray-900">{team.teamLeader}</p>
                </div>

                {/* Members */}
                <div className="mb-6">
                  <p className="text-gray-500 text-sm mb-3">Members ({team.members.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((member, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Specialities */}
                <div className="mb-6">
                  <p className="text-gray-900 font-semibold mb-3">Specialities:</p>
                  <div className="flex flex-wrap gap-2">
                    {team.specialities.map((speciality, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {speciality}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors">
                    Edit Team
                  </button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
