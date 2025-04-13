"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileSpreadsheet, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function Page() {
  const [exportType, setExportType] = useState<"shipment" | "fuel">("shipment")

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
            <span>/</span>
            <Link href="/dashboard/reports" className="hover:text-primary">Reports</Link>
            <span>/</span>
            <span className="text-foreground">Data Export</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Data Export</h2>
          <p className="text-muted-foreground">
            Export shipment and fuel expense data for analysis.
          </p>
        </div>
      </div>

      <Tabs defaultValue="shipment" className="space-y-4" onValueChange={(value) => setExportType(value as "shipment" | "fuel")}>
        <TabsList>
          <TabsTrigger value="shipment">Shipment Data</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="shipment">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Data Export</CardTitle>
              <CardDescription>Export shipment data based on filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shipment Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Inbound" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inbound">Inbound</SelectItem>
                      <SelectItem value="outbound">Outbound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup/Drop Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="location1">Location 1</SelectItem>
                      <SelectItem value="location2">Location 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Trip Number</label>
                  <Input type="text" placeholder="Enter trip number" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Number</label>
                  <Input type="text" placeholder="Enter pickup number" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Pickup Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Material Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transporter Name</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trans1">Transporter 1</SelectItem>
                      <SelectItem value="trans2">Transporter 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Transporter Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="type1">Type 1</SelectItem>
                      <SelectItem value="type2">Type 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sup1">Supplier 1</SelectItem>
                      <SelectItem value="sup2">Supplier 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Supplier Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loc1">Location 1</SelectItem>
                      <SelectItem value="loc2">Location 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Relationship Name</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rel1">Relationship 1</SelectItem>
                      <SelectItem value="rel2">Relationship 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Customers</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cust1">Customer 1</SelectItem>
                      <SelectItem value="cust2">Customer 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Pickup Create</label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To Pickup Create</label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">From Expected Pickup Date</label>
                  <Input type="date" defaultValue="2025-04-01" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To Expected Pickup Date</label>
                  <Input type="date" defaultValue="2025-04-11" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">From Actual Pickup Date</label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To Actual Pickup Date</label>
                  <Input type="date" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Expense Export</CardTitle>
              <CardDescription>Export fuel expense data based on filters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Vehicle</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v1">Toyota Hilux</SelectItem>
                      <SelectItem value="v2">Ford Ranger</SelectItem>
                      <SelectItem value="v3">Isuzu D-Max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">From Date</label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">To Date</label>
                  <Input type="date" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Amount</label>
                  <Input type="number" placeholder="Enter minimum amount" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Amount</label>
                  <Input type="number" placeholder="Enter maximum amount" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Efficiency (km/L)</label>
                  <Input type="number" placeholder="Enter minimum efficiency" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum Efficiency (km/L)</label>
                  <Input type="number" placeholder="Enter maximum efficiency" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <Button onClick={() => console.log("Exporting data...")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )
} 