"use client"

import { useState } from "react"
import {
  BarChart3,
  Download,
  Upload,
  TrendingUp,
  Truck,
  User,
  Wrench,
  IndianRupee,
  Calendar,
  Receipt,
  FileText,
  Camera,
  Plus,
  Filter,
  Fuel,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
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

// Mock data for demonstration
const tripExpenses = [
  {
    id: "1",
    type: "fuel",
    amount: 5000,
    date: new Date(2024, 2, 15),
    trip: "Mumbai-Delhi",
    driver: "John Doe",
    vehicle: "MH-01-AB-1234",
    status: "approved",
    receipt: "receipt-001.jpg",
  },
  {
    id: "2",
    type: "toll",
    amount: 1200,
    date: new Date(2024, 2, 16),
    trip: "Mumbai-Delhi",
    driver: "John Doe",
    vehicle: "MH-01-AB-1234",
    status: "pending",
    receipt: "toll-001.pdf",
  },
  {
    id: "3",
    type: "allowance",
    amount: 2000,
    date: new Date(2024, 2, 15),
    trip: "Mumbai-Delhi",
    driver: "John Doe",
    status: "approved",
  },
]

const vehicleExpenses = [
  {
    id: "1",
    type: "maintenance",
    amount: 15000,
    date: new Date(2024, 2, 10),
    vehicle: "MH-01-AB-1234",
    description: "Regular Service",
    status: "approved",
    invoice: "invoice-001.pdf",
  },
  {
    id: "2",
    type: "tires",
    amount: 24000,
    date: new Date(2024, 2, 12),
    vehicle: "MH-01-AB-1234",
    description: "4 New Tires",
    status: "pending",
    invoice: "invoice-002.pdf",
  },
  {
    id: "3",
    type: "insurance",
    amount: 45000,
    date: new Date(2024, 2, 1),
    vehicle: "MH-01-AB-1234",
    description: "Annual Premium",
    status: "approved",
    invoice: "insurance-001.pdf",
  },
]

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

export default function ExpensesPage() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "quarter" | "year">("month")
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [expenseType, setExpenseType] = useState<"trip" | "vehicle" | "fuel">("trip")
  const { toast } = useToast()

  const handleScanReceipt = () => {
    toast({
      title: "Receipt Scanned",
      description: "The receipt has been scanned and details extracted.",
    })
  }

  const handleAddExpense = () => {
    toast({
      title: "Expense Added",
      description: "The expense has been added and sent for approval.",
    })
    setShowAddExpense(false)
  }

  const handleSync = () => {
    toast({
      title: "Sync Complete",
      description: "Expenses have been synced with accounting software.",
    })
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-muted-foreground">
            Track and manage trip and vehicle expenses.
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
          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Add a new expense with receipt or invoice.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Expense Type</Label>
                  <Select value={expenseType} onValueChange={(value: "trip" | "vehicle" | "fuel") => setExpenseType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expense type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trip">Trip Expense</SelectItem>
                      <SelectItem value="vehicle">Vehicle Expense</SelectItem>
                      <SelectItem value="fuel">Fuel Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {expenseType === "trip" && (
                  <>
                    <div className="grid gap-2">
                      <Label>Trip</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trip" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="trip1">Mumbai-Delhi (15 Mar)</SelectItem>
                          <SelectItem value="trip2">Bangalore-Chennai (16 Mar)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fuel">Fuel</SelectItem>
                          <SelectItem value="toll">Toll</SelectItem>
                          <SelectItem value="allowance">Driver Allowance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {expenseType === "vehicle" && (
                  <>
                    <div className="grid gap-2">
                      <Label>Vehicle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">MH-01-AB-1234</SelectItem>
                          <SelectItem value="v2">MH-01-CD-5678</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="tires">Tires</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {expenseType === "fuel" && (
                  <>
                    <div className="grid gap-2">
                      <Label>Vehicle</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="v1">Toyota Hilux</SelectItem>
                          <SelectItem value="v2">Ford Ranger</SelectItem>
                          <SelectItem value="v3">Isuzu D-Max</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Fuel Details</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input type="number" placeholder="Liters" />
                        <Input type="number" placeholder="Price per Liter" />
                        <Input type="number" placeholder="Distance (km)" />
                        <Input type="number" placeholder="Efficiency (km/L)" disabled />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid gap-2">
                  <Label>Amount</Label>
                  <Input type="number" placeholder="Enter amount" />
                </div>

                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input type="date" />
                </div>

                <div className="grid gap-2">
                  <Label>Description</Label>
                  <Input placeholder="Enter description" />
                </div>

                <div className="grid gap-2">
                  <Label>Receipt/Invoice</Label>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Handle file upload
                          toast({
                            title: "File Selected",
                            description: `Selected file: ${file.name}`,
                          })
                        }
                      }}
                    />
                    <Button onClick={handleScanReceipt}>
                      <Camera className="mr-2 h-4 w-4" />
                      Scan Receipt
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  className="bg-secondary hover:bg-secondary/80" 
                  onClick={() => setShowAddExpense(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddExpense}>Add Expense</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-secondary hover:bg-secondary/80" 
            onClick={handleSync}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Sync with QuickBooks
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trip" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trip" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Trip Expenses
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Vehicle Expenses
          </TabsTrigger>
          <TabsTrigger value="fuel" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Fuel Expenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fuel">
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

          <Card className="mt-4">
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
        </TabsContent>

        <TabsContent value="trip">
          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid gap-4">
                {tripExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {expense.type === "fuel" ? (
                          <Receipt className="h-6 w-6 text-primary" />
                        ) : expense.type === "toll" ? (
                          <FileText className="h-6 w-6 text-primary" />
                        ) : (
                          <IndianRupee className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold capitalize">{expense.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(expense.date, "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">₹{expense.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{expense.trip}</p>
                      </div>
                      <Badge className={`
                        ${expense.status === "approved" ? "bg-green-500 text-white" : ""}
                        ${expense.status === "pending" ? "bg-yellow-500 text-white" : ""}
                        ${expense.status === "rejected" ? "bg-red-500 text-white" : ""}
                      `}>
                        {expense.status}
                      </Badge>
                      {expense.receipt && (
                        <Button 
                          className="h-8 w-8 p-0" 
                          onClick={() => window.open(`/api/expenses/receipts/${expense.receipt}`, '_blank')}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vehicle">
          <div className="rounded-md border">
            <div className="p-4">
              <div className="grid gap-4">
                {vehicleExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {expense.type === "maintenance" ? (
                          <Wrench className="h-6 w-6 text-primary" />
                        ) : expense.type === "tires" ? (
                          <Truck className="h-6 w-6 text-primary" />
                        ) : (
                          <FileText className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold capitalize">{expense.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format(expense.date, "dd MMM yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">₹{expense.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                      </div>
                      <Badge className={`
                        ${expense.status === "approved" ? "bg-green-500 text-white" : ""}
                        ${expense.status === "pending" ? "bg-yellow-500 text-white" : ""}
                        ${expense.status === "rejected" ? "bg-red-500 text-white" : ""}
                      `}>
                        {expense.status}
                      </Badge>
                      {expense.invoice && (
                        <Button 
                          className="h-8 w-8 p-0" 
                          onClick={() => window.open(`/api/expenses/invoices/${expense.invoice}`, '_blank')}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 