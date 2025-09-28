"use client"

import { redirect } from "next/navigation"

export default function TimesheetArchiveRedirect() {
  redirect("/timesheet?tab=archived")
}


