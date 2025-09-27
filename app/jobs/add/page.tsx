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

export default function AddJobPage() {
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
              <Link href="/jobs">
                <ArrowLeft className="w-6 h-6 text-[#000000] cursor-pointer hover:text-[#ff622a]" />
              </Link>
              <h2 className="text-xl font-semibold text-[#000000]">New Job Details</h2>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-6 py-3 bg-[#fff0ea] text-[#ff622a] rounded-full text-sm font-medium cursor-pointer">
                General Information
              </div>
              <Link href="/jobs/add/team">
                <div className="flex items-center gap-2 px-6 py-3 bg-[#eff0f6] text-[#999999] rounded-full text-sm font-medium cursor-pointer hover:bg-[#e4e4e7] transition-colors">
                  Team Assignment
                </div>
              </Link>
              <div className="flex items-center gap-2 px-6 py-3 bg-[#eff0f6] text-[#999999] rounded-full text-sm font-medium cursor-pointer">
                Site Information
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg p-8">
              <div className="space-y-6">
                {/* Job Type */}
                <div>
                  <label className="block text-[#000000] font-medium mb-2">Job Type</label>
                  <Input
                    placeholder="e.g. Drywall installation, Plastering, Painting"
                    className="bg-white border-[#d9d9d9] focus:border-[#ff622a]"
                  />
                </div>

                {/* Job Address */}
                <div>
                  <label className="block text-[#000000] font-medium mb-2">Job Address</label>
                  <Input placeholder="Enter job address" className="bg-white border-[#d9d9d9] focus:border-[#ff622a]" />
                  <p className="text-[#999999] text-sm mt-1">Start typing to see suggested address from google maps</p>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#000000] font-medium mb-2">Started at</label>
                    <Input
                      type="date"
                      defaultValue="2025-09-02"
                      className="bg-white border-[#d9d9d9] focus:border-[#ff622a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#000000] font-medium mb-2">Ending at</label>
                    <Input
                      type="date"
                      defaultValue="2025-09-17"
                      className="bg-white border-[#d9d9d9] focus:border-[#ff622a]"
                    />
                  </div>
                </div>

                {/* Client Name */}
                <div>
                  <label className="block text-[#000000] font-medium mb-2">Client Name</label>
                  <Input placeholder="Enter Client Name" className="bg-white border-[#d9d9d9] focus:border-[#ff622a]" />
                </div>

                {/* Client Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#000000] font-medium mb-2">Client Phone</label>
                    <Input type="tel" className="bg-white border-[#d9d9d9] focus:border-[#ff622a]" />
                  </div>
                  <div>
                    <label className="block text-[#000000] font-medium mb-2">Client Mail</label>
                    <Input type="email" className="bg-white border-[#d9d9d9] focus:border-[#ff622a]" />
                  </div>
                </div>

                {/* Other Notes */}
                <div>
                  <label className="block text-[#000000] font-medium mb-2">Other Notes</label>
                  <Textarea rows={6} className="bg-white border-[#d9d9d9] focus:border-[#ff622a] resize-none" />
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
                  <Button className="bg-[#192d47] hover:bg-[#2a4a6b] text-white">Save</Button>
                  <Link href="/jobs/add/team">
                    <Button className="bg-[#ff622a] hover:bg-[#fd7d4f] text-white">Next</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
