"use client"

import { useState } from "react"
import { SharedSidebar } from "@/components/shared-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Satellite, Sun, Wind, Droplets, Plus, Download, Bell, Calendar, Cloud, CloudRain } from "lucide-react"
import { JobMapView } from "@/components/ui/JobMapView"
import { useQuery } from "@tanstack/react-query"
import { Job } from "@/shared/schema"

interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  visibility: number
  condition: 'sunny' | 'cloudy' | 'rainy'
  riskLevel: 'low' | 'medium' | 'high'
}

export default function MapsPage() {
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<string>("")
  const [selectedSite, setSelectedSite] = useState<Job | null>(null)
  const [mapView, setMapView] = useState<'standard' | 'satellite'>('standard')
  const [originSite, setOriginSite] = useState<string>("")
  const [destinationSite, setDestinationSite] = useState<string>("")
  const [selectedStatus,setSelectedStatus] = useState('in_progress')
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 22,
    humidity: 65,
    windSpeed: 15,
    visibility: 10,
    condition: 'sunny',
    riskLevel: 'low'
  })

  // Fetch jobs data
  const fetchWithError = async (url: string) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    }
    return response.json()
  }
  
  const { data: jobs = [], isLoading: isJobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    queryFn: () => fetchWithError('/api/jobs'),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Sample job sites for demonstration
  const sampleJobSites = [
    {
      id: "1",
      jobType: "Plumbing Installation",
      address: "123 Queen Street, Auckland CBD, Auckland 1010",
      status: "in_progress" as const,
      latitude: -36.8485,
      longitude: 174.7633,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    },
    {
      id: "2", 
      jobType: "HVAC Maintenance",
      address: "456 Albert Street, Auckland CBD, Auckland 1010",
      status: "scheduled" as const,
      latitude: -36.8465,
      longitude: 174.7645,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    },
    {
      id: "3",
      jobType: "Electrical Work",
      address: "789 Customs Street, Auckland CBD, Auckland 1010", 
      status: "completed" as const,
      latitude: -36.8442,
      longitude: 174.7691,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString()
    }
  ]

  const jobSites = jobs.filter((job)=>selectedStatus === job.status)

  const handleSiteSelection = (job: Job) => {
    setSelectedSite(job)
    setSelectedLocation(job.address || "")
  }

  const handleExportReport = () => {
    // Create a simple report
    const reportData = {
      selectedSite: selectedSite?.address || "No site selected",
      weather: weatherData,
      timestamp: new Date().toISOString(),
      jobSites: jobSites.map(job => ({
        type: job.jobType,
        address: job.address,
        status: job.status
      }))
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `site-report-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSetWeatherAlerts = () => {
    alert("Weather alerts configured! You will be notified of severe weather conditions.")
  }

  const handleScheduleAdjustments = () => {
    alert("Schedule adjustment interface opened. Redirecting to timeline view...")
  }

  const handleAddEntry = () => {
    alert("Add new job entry form would open here.")
  }

  const toggleMapView = () => {
    setMapView(prev => prev === 'standard' ? 'satellite' : 'standard')
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-[#ff622a]" />
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500" />
      case 'rainy':
        return <CloudRain className="w-8 h-8 text-blue-500" />
      default:
        return <Sun className="w-8 h-8 text-[#ff622a]" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

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
            <Button 
              className="bg-[#ff622a] hover:bg-[#e55520] text-white"
              onClick={handleAddEntry}
            >
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
                    <Badge variant="outline" className={selectedStatus==='in_progress'? "text-blue-600 border-blue-200" :"text-blue-400 border-blue-200"} onClick={()=>setSelectedStatus('in_progress')}>
                      In Progress
                    </Badge>
                    <Badge variant="outline" className={ selectedStatus === 'scheduled' ? "text-yellow-600 border-yellow-200":"text-yellow-300 border-yellow-100"} onClick={()=>setSelectedStatus('scheduled')}>
                      Scheduled
                    </Badge>
                    <Badge variant="outline" className={selectedStatus === 'complete' ? "text-green-600 border-green-200 bg-green-50":"text-green-700 border-green-100 bg-green-40"} onClick={()=>setSelectedStatus('complete')}>
                      Complete
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={toggleMapView}>
                    <Satellite className="w-4 h-4 mr-2" />
                    {mapView === 'standard' ? 'Satellite' : 'Standard'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative h-80 bg-gray-100 rounded-lg overflow-hidden">
                {/* Map View */}
                <JobMapView 
                  jobs={jobSites} 
                  className="h-full w-full" 
                  onSelectLocation={(address) => setSelectedLocation(address)}
                  showTraffic={true}
                  
                />

                {/* Map pins with job addresses */}
                {jobSites.map((job, index) => {
                  const statusColors = {
                    in_progress: 'bg-blue-500',
                    scheduled: 'bg-yellow-500', 
                    completed: 'bg-green-500'
                  }
                  
                  return (
                    <div
                      key={job.id}
                      className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10"
                      style={{
                        left: `${20 + (index * 25)}%`,
                        top: `${30 + (index * 15)}%`
                      }}
                      onClick={() => handleSiteSelection(job)}
                    >
                      <div
  className={`w-8 h-8 ${statusColors[job.status as keyof typeof statusColors]} rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:scale-110 transition-transform`}
>
  <MapPin className="w-4 h-4 text-white" />
</div>

                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2 min-w-[200px] text-xs border">
                        <div className="font-semibold text-gray-900">{job.jobType}</div>
                        <div className="text-gray-600 mt-1">{job.address}</div>
                        <div className="mt-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              job.status === 'in_progress' ? 'text-blue-600 border-blue-200' :
                              job.status === 'scheduled' ? 'text-yellow-600 border-yellow-200' :
                              'text-green-600 border-green-200'
                            }`}
                          >
                            {job.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        {job.latitude && job.longitude && (
                          <div className="text-gray-500 mt-1">
                            Lat: {job.latitude.toFixed(4)}, Lng: {job.longitude.toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Selected Site Card */}
                {selectedSite && (
                  <div className="absolute bottom-4 left-4 z-20">
                    <Card className="w-64">
                      <CardContent className="p-3">
                        <p className="text-xs text-gray-600 mb-1">Selected Site</p>
                        <p className="font-medium">{selectedSite.jobType}</p>
                        <p className="text-sm text-gray-600 mt-1">{selectedSite.address}</p>
                        <Badge 
                          variant="outline" 
                          className="mt-2"
                        >
                          {selectedSite.status?.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                )}
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
              <Button 
                variant="outline" 
                size="sm" 
                className="text-[#ff622a] border-[#ff622a] bg-transparent hover:bg-[#ff622a] hover:text-white"
                onClick={() => alert("Detailed weather view opened")}
              >
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
                      {getWeatherIcon(weatherData.condition)}
                    </div>
                    <div className="text-3xl font-bold mb-2">{weatherData.temperature}°C</div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <span>{weatherData.windSpeed}km/h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-gray-500" />
                      <span>{weatherData.humidity}%</span>
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
                      <span className={`text-2xl font-bold ${getRiskColor(weatherData.riskLevel)}`}>
                        {weatherData.riskLevel === 'low' ? '2' : weatherData.riskLevel === 'medium' ? '5' : '8'}
                      </span>
                    </div>
                    <div className={`text-lg font-semibold ${getRiskColor(weatherData.riskLevel)}`}>
                      {weatherData.riskLevel.charAt(0).toUpperCase() + weatherData.riskLevel.slice(1)} Risk
                    </div>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start bg-transparent hover:bg-gray-50"
                    onClick={handleExportReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Site Report
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start bg-transparent hover:bg-gray-50"
                    onClick={handleSetWeatherAlerts}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Set Weather Alerts
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start bg-transparent hover:bg-gray-50"
                    onClick={handleScheduleAdjustments}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
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
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">{weatherData.temperature}°C</div>
                  <div className="text-sm text-gray-600">Temperature</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">{weatherData.humidity}%</div>
                  <div className="text-sm text-gray-600">Humidity</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">{weatherData.windSpeed}</div>
                  <div className="text-sm text-gray-600">km/h Wind</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#ff622a] mb-1">{weatherData.visibility}km</div>
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
                  { day: "Today", temp: "24°C", rain: "10%", condition: "sunny" },
                  { day: "Tomorrow", temp: "26°C", rain: "30%", condition: "cloudy" },
                  { day: "Wednesday", temp: "23°C", rain: "60%", condition: "rainy" },
                  { day: "Thursday", temp: "21°C", rain: "20%", condition: "cloudy" },
                  { day: "Friday", temp: "25°C", rain: "5%", condition: "sunny" },
                ].map((forecast, index) => (
                  <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-600 mb-2">{forecast.day}</div>
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        {getWeatherIcon(forecast.condition)}
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
              <CardTitle>Week Summary</CardTitle>
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
                  <Select value={originSite} onValueChange={setOriginSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Origin" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobSites.map((job) => (
                        <SelectItem key={`origin-${job.id}`} value={job.id.toString()}>
                          {job.jobType} - {job.address?.split(',')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Destination Job Site</label>
                  <Select value={destinationSite} onValueChange={setDestinationSite}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobSites.map((job) => (
                        <SelectItem key={`dest-${job.id}`} value={job.id.toString()}>
                          {job.jobType} - {job.address?.split(',')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Traffic Route Information</h4>
                {originSite && destinationSite ? (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">12 min</div>
                        <div className="text-sm text-gray-600">Estimated Time</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">8.5 km</div>
                        <div className="text-sm text-gray-600">Distance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">Light</div>
                        <div className="text-sm text-gray-600">Traffic</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#ff622a] hover:bg-[#e55520] text-white">
                      Get Detailed Directions
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Select both an origin and destination job site above to view traffic information and estimated travel time.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}