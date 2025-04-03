"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Calendar, Download, Fuel, Route, Search, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GoogleMapComponent from "@/components/maps/google-map"

// Mock data for fuel efficiency
const mockFuelData = [
  {
    vehicle: "Toyota Hilux",
    route: "Johannesburg to Pretoria",
    distance: 58,
    fuelUsed: 5.2,
    efficiency: 11.2,
    date: "2023-04-02",
  },
  {
    vehicle: "Ford Ranger",
    route: "Pretoria to Centurion",
    distance: 25,
    fuelUsed: 2.8,
    efficiency: 8.9,
    date: "2023-04-02",
  },
  {
    vehicle: "Toyota Hilux",
    route: "Pretoria to Johannesburg",
    distance: 58,
    fuelUsed: 5.5,
    efficiency: 10.5,
    date: "2023-04-01",
  },
  {
    vehicle: "Volkswagen Transporter",
    route: "Johannesburg to Soweto",
    distance: 28,
    fuelUsed: 3.2,
    efficiency: 8.8,
    date: "2023-04-01",
  },
  {
    vehicle: "Toyota Land Cruiser",
    route: "Johannesburg to Kruger",
    distance: 420,
    fuelUsed: 42.5,
    efficiency: 9.9,
    date: "2023-03-30",
  },
  {
    vehicle: "Toyota Hilux",
    route: "Johannesburg to Durban",
    distance: 568,
    fuelUsed: 48.5,
    efficiency: 11.7,
    date: "2023-03-28",
  },
  {
    vehicle: "Ford Ranger",
    route: "Pretoria to Bloemfontein",
    distance: 410,
    fuelUsed: 38.2,
    efficiency: 10.7,
    date: "2023-03-25",
  },
  {
    vehicle: "Isuzu D-Max",
    route: "Johannesburg to Cape Town",
    distance: 1398,
    fuelUsed: 125.6,
    efficiency: 11.1,
    date: "2023-03-20",
  },
]

// Mock data for efficiency by vehicle
const efficiencyByVehicle = [
  { name: "Toyota Hilux", efficiency: 11.1 },
  { name: "Ford Ranger", efficiency: 9.8 },
  { name: "Isuzu D-Max", efficiency: 11.1 },
  { name: "Volkswagen Transporter", efficiency: 8.8 },
  { name: "Toyota Land Cruiser", efficiency: 9.9 },
]

// Mock data for efficiency over time
const efficiencyOverTime = [
  { date: "2023-03-01", efficiency: 10.2 },
  { date: "2023-03-08", efficiency: 10.5 },
  { date: "2023-03-15", efficiency: 10.8 },
  { date: "2023-03-22", efficiency: 10.3 },
  { date: "2023-03-29", efficiency: 10.7 },
  { date: "2023-04-05", efficiency: 11.0 },
]

// Generate colors for heatmap
const generateHeatmapColor = (efficiency: number) => {
  // Red for low efficiency, green for high
  const min = 8.5
  const max = 12
  const normalized = Math.min(Math.max((efficiency - min) / (max - min), 0), 1)

  // RGB interpolation from red to green
  const r = Math.round(255 * (1 - normalized))
  const g = Math.round(255 * normalized)
  const b = 0

  return `rgb(${r}, ${g}, ${b})`
}

export default function FuelEfficiencyPage() {
  const [vehicleFilter, setVehicleFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter data based on filters
  const filteredData = mockFuelData.filter((item) => {
    const matchesVehicle = vehicleFilter === "all" || item.vehicle === vehicleFilter
    const matchesDate = dateFilter === "all" || item.date === dateFilter
    const matchesSearch =
      item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.route.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesVehicle && matchesDate && matchesSearch
  })

  // Calculate averages
  const averageEfficiency =
    filteredData.length > 0 ? filteredData.reduce((sum, item) => sum + item.efficiency, 0) / filteredData.length : 0

  const totalDistance = filteredData.reduce((sum, item) => sum + item.distance, 0)
  const totalFuel = filteredData.reduce((sum, item) => sum + item.fuelUsed, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fuel Efficiency Reports</h1>
          <p className="text-muted-foreground">Analyze fuel consumption and efficiency across your fleet</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search routes or vehicles..."
            className="w-full appearance-none pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <SelectValue placeholder="Filter by vehicle" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vehicles</SelectItem>
            <SelectItem value="Toyota Hilux">Toyota Hilux</SelectItem>
            <SelectItem value="Ford Ranger">Ford Ranger</SelectItem>
            <SelectItem value="Isuzu D-Max">Isuzu D-Max</SelectItem>
            <SelectItem value="Volkswagen Transporter">Volkswagen Transporter</SelectItem>
            <SelectItem value="Toyota Land Cruiser">Toyota Land Cruiser</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <SelectValue placeholder="Filter by date" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dates</SelectItem>
            <SelectItem value="2023-04-02">April 2, 2023</SelectItem>
            <SelectItem value="2023-04-01">April 1, 2023</SelectItem>
            <SelectItem value="2023-03-30">March 30, 2023</SelectItem>
            <SelectItem value="2023-03-28">March 28, 2023</SelectItem>
            <SelectItem value="2023-03-25">March 25, 2023</SelectItem>
            <SelectItem value="2023-03-20">March 20, 2023</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Efficiency</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageEfficiency.toFixed(1)} km/L</div>
            <p className="text-xs text-muted-foreground">Based on {filteredData.length} trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toLocaleString()} km</div>
            <p className="text-xs text-muted-foreground">Across all filtered trips</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Used</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFuel.toFixed(1)} L</div>
            <p className="text-xs text-muted-foreground">Across all filtered trips</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and maps */}
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table">Data Table</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="heatmap">Route Heatmap</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Efficiency Data</CardTitle>
              <CardDescription>Detailed breakdown of fuel consumption by trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-12 px-4 text-left font-medium">Vehicle</th>
                        <th className="h-12 px-4 text-left font-medium">Route</th>
                        <th className="h-12 px-4 text-left font-medium">Date</th>
                        <th className="h-12 px-4 text-left font-medium">Distance (km)</th>
                        <th className="h-12 px-4 text-left font-medium">Fuel Used (L)</th>
                        <th className="h-12 px-4 text-left font-medium">Efficiency (km/L)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-4">{item.vehicle}</td>
                          <td className="p-4">{item.route}</td>
                          <td className="p-4">{new Date(item.date).toLocaleDateString()}</td>
                          <td className="p-4">{item.distance}</td>
                          <td className="p-4">{item.fuelUsed.toFixed(1)}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-3 w-3 rounded-full"
                                style={{ backgroundColor: generateHeatmapColor(item.efficiency) }}
                              />
                              <span>{item.efficiency.toFixed(1)}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Efficiency by Vehicle</CardTitle>
                <CardDescription>Average fuel efficiency (km/L) for each vehicle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={efficiencyByVehicle} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 15]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="efficiency" name="Efficiency (km/L)" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efficiency Over Time</CardTitle>
                <CardDescription>Trend of fuel efficiency over the past weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={efficiencyOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
                        }
                      />
                      <YAxis domain={[8, 12]} />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        formatter={(value) => [`${value} km/L`, "Efficiency"]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        name="Efficiency (km/L)"
                        stroke="#3B82F6"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Efficiency Heatmap</CardTitle>
              <CardDescription>Visual representation of fuel efficiency across different routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-md border overflow-hidden">
                <GoogleMapComponent height="100%" />
              </div>
              <div className="mt-4 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full bg-red-500" />
                  <span className="text-sm">Low Efficiency</span>
                  <div className="mx-2 h-px w-8 bg-muted" />
                  <div className="h-4 w-4 rounded-full bg-yellow-500" />
                  <span className="text-sm">Medium Efficiency</span>
                  <div className="mx-2 h-px w-8 bg-muted" />
                  <div className="h-4 w-4 rounded-full bg-green-500" />
                  <span className="text-sm">High Efficiency</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

