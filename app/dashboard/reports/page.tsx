"use client"

import { useState } from "react"
import {
  BarChart3,
  Download,
  Mail,
  TrendingUp,
  Truck,
  User,
  Wrench,
  IndianRupee,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

// Mock data for demonstration
const financialData = {
  revenue: 125000,
  expenses: 85000,
  fuelCosts: [
    { month: "Jan", cost: 12000 },
    { month: "Feb", cost: 11500 },
    { month: "Mar", cost: 13000 },
  ],
  profitableRoutes: [
    { route: "Mumbai-Delhi", profit: 15000 },
    { route: "Bangalore-Chennai", profit: 12000 },
    { route: "Pune-Hyderabad", profit: 10000 },
  ],
}

const operationalData = {
  vehicleUtilization: 78,
  totalTrips: 450,
  onTimeDelivery: 92,
  idleTime: 15,
  topDrivers: [
    { name: "John Doe", rating: 4.8, trips: 45 },
    { name: "Jane Smith", rating: 4.7, trips: 42 },
    { name: "Mike Johnson", rating: 4.6, trips: 38 },
  ],
}

const maintenanceData = {
  totalCost: 35000,
  serviceCount: 24,
  upcomingServices: 3,
  costBreakdown: [
    { type: "Regular Service", cost: 15000 },
    { type: "Repairs", cost: 12000 },
    { type: "Tires", cost: 8000 },
  ],
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel" | "csv">("pdf")
  const { toast } = useToast()

  const handleExport = () => {
    toast({
      title: "Report Exported",
      description: `The report has been exported in ${exportFormat.toUpperCase()} format.`,
    })
  }

  const handleScheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "The report will be sent to your email as per the schedule.",
    })
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            View detailed reports and insights about your fleet operations.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={(value: "week" | "month" | "quarter" | "year") => setDateRange(value)}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={exportFormat} onValueChange={(value: "pdf" | "excel" | "csv") => setExportFormat(value)}>
            <SelectTrigger className="w-[150px]">
              <Download className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Export as" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>Export Report</Button>
        </div>
      </div>

      <Tabs defaultValue="financial" className="space-y-6">
        <TabsList>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Financial Reports
          </TabsTrigger>
          <TabsTrigger value="operational" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Operational Reports
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Maintenance Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Trip Profitability</CardTitle>
                <CardDescription>Revenue vs Expenses Analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Revenue</span>
                    <span className="text-green-600">₹{financialData.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Expenses</span>
                    <span className="text-red-600">₹{financialData.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span>Net Profit</span>
                    <span className="text-blue-600">₹{(financialData.revenue - financialData.expenses).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fuel Cost Trends</CardTitle>
                <CardDescription>Monthly Fuel Expenditure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.fuelCosts.map((item) => (
                    <div key={item.month} className="flex items-center justify-between">
                      <span>{item.month}</span>
                      <span>₹{item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Profitable Routes</CardTitle>
                <CardDescription>Top Performing Routes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.profitableRoutes.map((route) => (
                    <div key={route.route} className="flex items-center justify-between">
                      <span>{route.route}</span>
                      <span className="text-green-600">₹{route.profit.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Utilization</CardTitle>
                <CardDescription>Fleet Performance Metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Utilization Rate</span>
                    <span className="text-blue-600">{operationalData.vehicleUtilization}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Trips</span>
                    <span>{operationalData.totalTrips}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Idle Time</span>
                    <span>{operationalData.idleTime}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driver Performance</CardTitle>
                <CardDescription>Top Performing Drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {operationalData.topDrivers.map((driver) => (
                    <div key={driver.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{driver.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span>{driver.rating}⭐</span>
                        <span>{driver.trips} trips</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance</CardTitle>
                <CardDescription>On-time Delivery Metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>On-time Delivery</span>
                    <span className="text-green-600">{operationalData.onTimeDelivery}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Delay</span>
                    <span>23 mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Customer Satisfaction</span>
                    <span>4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Overview</CardTitle>
                <CardDescription>Service History & Costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Cost</span>
                    <span>₹{maintenanceData.totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Services Completed</span>
                    <span>{maintenanceData.serviceCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Upcoming Services</span>
                    <span className="text-yellow-600">{maintenanceData.upcomingServices}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Maintenance Cost Analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {maintenanceData.costBreakdown.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <span>{item.type}</span>
                      <span>₹{item.cost.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Settings</CardTitle>
                <CardDescription>Configure Report Delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Email Reports To</Label>
                    <Input type="email" placeholder="Enter email address" />
                  </div>
                  <div className="grid gap-2">
                    <Label>Schedule Frequency</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Include Charts</Label>
                    <Switch defaultChecked />
                  </div>
                  <Button onClick={handleScheduleReport} className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Schedule Reports
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 