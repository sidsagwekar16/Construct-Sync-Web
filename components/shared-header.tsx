"use client"

import { Bell } from "lucide-react"

interface SharedHeaderProps {
  title: string
}

export function SharedHeader({ title }: SharedHeaderProps) {
  return (
    <div className="bg-white px-8 py-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#232323]">{title}</h1>
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
  )
}

export default SharedHeader
