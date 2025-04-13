"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, Plus, Filter } from "lucide-react"

// Mock data for demonstration
const fuelExpenses = [
  {
    id: "1",
    vehicle: "Toyota Hilux",
    date: new Date(2024, 2, 15),
    amount: 5000,
    liters: 50,
    pricePerLiter: 100,
    efficiency: 11.2,
    distance: 560,
    type: "fuel",
    status: "approved",
    receipt: "receipt-001.jpg",
  },
  {
    id: "2",
    vehicle: "Ford Ranger",
    date: new Date(2024, 2, 16),
    amount: 4000,
    liters: 40,
    pricePerLiter: 100,
    efficiency: 9.8,
    distance: 392,
    type: "fuel",
    status: "approved",
    receipt: "receipt-002.jpg",
  },
  {
    id: "3",
    vehicle: "Isuzu D-Max",
    date: new Date(2024, 2, 17),
    amount: 4500,
    liters: 45,
    pricePerLiter: 100,
    efficiency: 10.5,
    distance: 472.5,
    type: "fuel",
    status: "approved",
    receipt: "receipt-003.jpg",
  },
]

export default function FuelExpensesPage() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month")

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Fuel Expenses</h2>
          <p className="text-muted-foreground">
            Track and analyze fuel consumption and expenses.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={(value: "week" | "month" | "quarter" | "year") => setDateRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Fuel Expense
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fuel Consumption Overview</CardTitle>
            <CardDescription>Monthly fuel consumption by vehicle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fuelExpenses} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicle" />
                  <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                  <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="liters" name="Fuel (Liters)" fill="#3B82F6" />
                  <Bar yAxisId="right" dataKey="efficiency" name="Efficiency (km/L)" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuel Cost Analysis</CardTitle>
            <CardDescription>Cost breakdown and efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fuelExpenses.map((expense) => (
                <div key={expense.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{expense.vehicle}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(expense.date, "dd MMM yyyy")}
                      </p>
                    </div>
                    <Badge variant="outline">₹{expense.amount}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Fuel:</span>
                      <span className="ml-2 font-medium">{expense.liters}L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price/L:</span>
                      <span className="ml-2 font-medium">₹{expense.pricePerLiter}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Efficiency:</span>
                      <span className="ml-2 font-medium">{expense.efficiency} km/L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="ml-2 font-medium">{expense.distance} km</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fuel Expense Details</CardTitle>
          <CardDescription>Detailed breakdown of all fuel expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left font-medium">Vehicle</th>
                    <th className="h-12 px-4 text-left font-medium">Date</th>
                    <th className="h-12 px-4 text-left font-medium">Amount</th>
                    <th className="h-12 px-4 text-left font-medium">Fuel (L)</th>
                    <th className="h-12 px-4 text-left font-medium">Price/L</th>
                    <th className="h-12 px-4 text-left font-medium">Efficiency</th>
                    <th className="h-12 px-4 text-left font-medium">Distance</th>
                    <th className="h-12 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fuelExpenses.map((expense) => (
                    <tr key={expense.id} className="border-b">
                      <td className="p-4">{expense.vehicle}</td>
                      <td className="p-4">{format(expense.date, "dd MMM yyyy")}</td>
                      <td className="p-4">₹{expense.amount}</td>
                      <td className="p-4">{expense.liters}L</td>
                      <td className="p-4">₹{expense.pricePerLiter}</td>
                      <td className="p-4">{expense.efficiency} km/L</td>
                      <td className="p-4">{expense.distance} km</td>
                      <td className="p-4">
                        <Badge variant={expense.status === "approved" ? "default" : "outline"}>
                          {expense.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 