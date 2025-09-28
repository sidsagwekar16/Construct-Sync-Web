"use client"

import { useRouter, useParams } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import SharedSidebar from "@/components/shared-sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function VariationDetailPage() {
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const params = useParams()
  const id = Number(params?.id)
  const router = useRouter()
  const queryClient = useQueryClient()

  const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
  }

  const { data: variation, isLoading, isError } = useQuery({
    queryKey: ["/api/variations", id],
    queryFn: () => fetcher(`/api/variations/${id}`),
    enabled: !isNaN(id)
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/variations/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Delete failed")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/variations"] })
      router.push("/variations")
    }
  })

  return (
    <div className="flex h-screen bg-[#eff0f6]">
      <SharedSidebar onMinimizeChange={setSidebarMinimized} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarMinimized ? "ml-20" : "ml-80"}`}>
        <div className="bg-white px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Variation #{id}</h1>
              <p className="text-gray-500 mt-1">View and manage this variation</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push("/variations")}>Back</Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 py-6 overflow-auto">
          {isLoading && (
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-1/3 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              </CardContent>
            </Card>
          )}

          {isError && (
            <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3">Failed to load variation.</div>
          )}

          {variation && (
            <div className="space-y-6">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="text-xl font-semibold mb-2">{variation.title}</div>
                  <div className="text-gray-600 mb-4">{variation.description}</div>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <div className="text-gray-500">Job</div>
                      <div>{variation.jobAddress || variation.jobId}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Status</div>
                      <div className="capitalize">{variation.status}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Priority</div>
                      <div className="capitalize">{variation.priority}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Pricing Model</div>
                      <div className="capitalize">{variation.pricingModel}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Client Amount</div>
                      <div>${Number(variation.clientAmount || 0).toFixed(2)}</div>
                    </div>
                    {variation.actualHours !== undefined && (
                      <div>
                        <div className="text-gray-500">Actual Hours</div>
                        <div>{Number(variation.actualHours).toFixed(2)} h</div>
                      </div>
                    )}
                    {variation.actualBill !== undefined && (
                      <div>
                        <div className="text-gray-500">Actual Bill</div>
                        <div>${Number(variation.actualBill).toFixed(2)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {Array.isArray(variation.photos) && variation.photos.length > 0 && (
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-6">
                    <div className="text-sm text-gray-700 mb-4">Photos ({variation.photos.length})</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {variation.photos.map((p: any, idx: number) => (
                        <img key={idx} src={p.url || p.path} alt="Variation photo" className="rounded-md object-cover h-40 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


