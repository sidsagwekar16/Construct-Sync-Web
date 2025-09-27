"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Satellite, Sun, Wind, Droplets, Plus } from "lucide-react"

export default function MapsPage() {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SharedSidebar onMinimizeChange={setIsMinimized} />

      <div className={`flex-1 transition-all duration-300 ${isMinimized ? "ml-20" : "ml-80"}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Location & Weather Intelligence</h1>
              <p className="text-gray-600 mt-1">
                Real-time location tracking and weather monitoring for active job sites
              </p>
            </div>
            <Button className="bg-[#ff622a] hover:bg-[#e55520] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </Button>
          </div>

          {/* Job Sites Map */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">Job Sites Map</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">View and select job sites on the map</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      In Progress
                    </Badge>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                      Scheduled
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Complete
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm">
                    <Satellite className="w-4 h-4 mr-2" />
                    Satellite
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
                {/* Map placeholder with overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#ff622a] rounded-full flex items-center justify-center mb-4 mx-auto">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Interactive Map View</h3>
                    <p className="text-white text-sm mb-1">Google Maps integration showing job site locations</p>
                    <p className="text-white text-xs opacity-90">Auckland, New Zealand region</p>
                  </div>
                </div>

                {/* Selected Site Card */}
                <div className="absolute bottom-4 left-4">
                  <Card className="w-48">
                    <CardContent className="p-3">
                      <p className="text-xs text-gray-600 mb-1">Selected Site</p>
                      <p className="font-medium">Settings</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Intelligence */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Weather Intelligence</h2>
                <p className="text-sm text-gray-600">Auckland CBD • Real-time weather monitoring</p>
              </div>
              <Button variant="outline" size="sm" className="text-[#ff622a] border-[#ff622a] bg-transparent">
                View more
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Current Conditions */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#ff622a] rounded-full"></div>
                    <CardTitle className="text-sm font-medium">Current Conditions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Sun className="w-8 h-8 text-[#ff622a]" />
                    </div>
                    <div className="text-3xl font-bold mb-2">22°C</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span>15km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-gray-500" />
                      <span>65%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#ff622a] rounded-full"></div>
                    <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl font-bold text-[#ff622a]">2</span>
                    </div>
                    <div className="text-lg font-semibold">Low Risk</div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#ff622a] rounded-full"></div>
                    <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Export Site Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Set Weather Alerts
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Schedule Adjustments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detailed Conditions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detailed Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">22°C</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">65%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">15</div>
                  <div className="text-sm text-gray-600">km/h Wind</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">10km</div>
                  <div className="text-sm text-gray-600">Visibility</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 5 Day Forecast */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5 Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { day: "Today", temp: "24°C", rain: "10%" },
                  { day: "Tomorrow", temp: "26°C", rain: "30%" },
                  { day: "Wednesday", temp: "23°C", rain: "60%" },
                  { day: "Thursday", temp: "21°C", rain: "20%" },
                  { day: "Friday", temp: "25°C", rain: "5%" },
                ].map((forecast, index) => (
                  <Card key={index} className="text-center">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-2">{forecast.day}</div>
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Sun className="w-4 h-4 text-[#ff622a]" />
                      </div>
                      <div className="font-semibold mb-1">{forecast.temp}</div>
                      <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
                        <Droplets className="w-3 h-3" />
                        {forecast.rain}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Conditions Summary */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Detailed Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">4</div>
                  <div className="text-sm text-gray-600">Workable Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">1</div>
                  <div className="text-sm text-gray-600">Risk Days</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">23°C</div>
                  <div className="text-sm text-gray-600">Avg Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">15mm</div>
                  <div className="text-sm text-gray-600">Total Rainfall</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Planner */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Traffic Planner</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Route details and traffic conditions between job sites</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Origin Job Site</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site1">Construction Site A</SelectItem>
                      <SelectItem value="site2">Construction Site B</SelectItem>
                      <SelectItem value="site3">Construction Site C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Destination Job Site</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site1">Construction Site A</SelectItem>
                      <SelectItem value="site2">Construction Site B</SelectItem>
                      <SelectItem value="site3">Construction Site C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Traffic Route Planner</h4>
                <p className="text-sm text-gray-600">
                  Select both an origin and destination job site above to view traffic information and estimated travel
                  time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
