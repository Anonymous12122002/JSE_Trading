"use client"

import { useState } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Filter, MoreHorizontal, Plus, Repeat, Settings, Wrench, Truck, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

// Event types and their colors
const eventTypes = {
  trip: { label: "Trip", color: "bg-blue-500", icon: Truck },
  maintenance: { label: "Maintenance", color: "bg-yellow-500", icon: Wrench },
  leave: { label: "Leave", color: "bg-green-500", icon: User },
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [showAddEventDialog, setShowAddEventDialog] = useState(false)
  const [eventType, setEventType] = useState<keyof typeof eventTypes>("trip")
  const [selectedView, setSelectedView] = useState<"month" | "week" | "day">("month")
  const { toast } = useToast()

  // Mock data for demonstration
  const events = [
    {
      id: "1",
      type: "trip",
      title: "Delivery to Mumbai",
      start: new Date(2024, 2, 15, 9, 0),
      end: new Date(2024, 2, 15, 17, 0),
      driver: "John Doe",
      vehicle: "MH-01-AB-1234",
      isRecurring: true,
      recurringPattern: "weekly",
    },
    {
      id: "2",
      type: "maintenance",
      title: "Vehicle Service",
      start: new Date(2024, 2, 20, 10, 0),
      end: new Date(2024, 2, 20, 12, 0),
      vehicle: "MH-01-AB-1234",
      serviceType: "Regular Maintenance",
    },
    {
      id: "3",
      type: "leave",
      title: "Vacation",
      start: new Date(2024, 2, 25),
      end: new Date(2024, 2, 28),
      driver: "John Doe",
      status: "pending",
    },
  ]

  const handleAddEvent = (data: FormData) => {
    // TODO: Implement event creation logic
    toast({
      title: "Event Added",
      description: "The event has been added to the calendar.",
    })
    setShowAddEventDialog(false)
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground">
            Schedule trips, track maintenance, and manage leave requests.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedView} onValueChange={(value: "month" | "week" | "day") => setSelectedView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={showAddEventDialog} onOpenChange={setShowAddEventDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>
                  Create a new calendar event for trips, maintenance, or leave.
                </DialogDescription>
              </DialogHeader>
              <form className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Event Type</Label>
                  <Select value={eventType} onValueChange={(value: keyof typeof eventTypes) => setEventType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(eventTypes).map(([type, { label }]) => (
                        <SelectItem key={type} value={type}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input placeholder="Enter event title" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Start Date</Label>
                    <Input type="datetime-local" />
                  </div>
                  <div className="grid gap-2">
                    <Label>End Date</Label>
                    <Input type="datetime-local" />
                  </div>
                </div>

                {eventType === "trip" && (
                  <>
                    <div className="grid gap-2">
                      <Label>Driver</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Doe</SelectItem>
                          <SelectItem value="jane">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                    <div className="flex items-center gap-2">
                      <Switch id="recurring" />
                      <Label htmlFor="recurring">Recurring Trip</Label>
                    </div>
                  </>
                )}

                {eventType === "maintenance" && (
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
                      <Label>Service Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="regular">Regular Maintenance</SelectItem>
                          <SelectItem value="tire">Tire Rotation</SelectItem>
                          <SelectItem value="oil">Oil Change</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Notes</Label>
                      <Textarea placeholder="Add maintenance notes..." />
                    </div>
                  </>
                )}

                {eventType === "leave" && (
                  <>
                    <div className="grid gap-2">
                      <Label>Driver</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="john">John Doe</SelectItem>
                          <SelectItem value="jane">Jane Smith</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Leave Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label>Reason</Label>
                      <Textarea placeholder="Provide reason for leave..." />
                    </div>
                  </>
                )}
              </form>
              <DialogFooter>
                <Button onClick={() => setShowAddEventDialog(false)} className="bg-secondary text-secondary-foreground hover:bg-secondary/80">
                  Cancel
                </Button>
                <Button onClick={() => handleAddEvent(new FormData())}>
                  Add Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Calendar View */}
        <div className="col-span-9 rounded-lg border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => date && setDate(date)}
            className="rounded-md"
          />
          <div className="p-4">
            <h3 className="font-semibold">Events for {format(date, "MMMM d, yyyy")}</h3>
            <div className="mt-4 space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 rounded-lg border p-4"
                >
                  <div className={`h-4 w-4 rounded-full ${eventTypes[event.type as keyof typeof eventTypes].color}`} />
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
                    </p>
                  </div>
                  {event.type === "trip" && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{event.driver}</span>
                      <Truck className="h-4 w-4 ml-2" />
                      <span className="text-sm">{event.vehicle}</span>
                      {event.isRecurring && <Repeat className="h-4 w-4 ml-2 text-blue-500" />}
                    </div>
                  )}
                  {event.type === "maintenance" && (
                    <Badge className="flex items-center gap-2 border bg-secondary text-secondary-foreground">
                      <Wrench className="h-4 w-4" />
                      {event.serviceType}
                    </Badge>
                  )}
                  {event.type === "leave" && (
                    <Badge
                      className={
                        event.status === "pending"
                          ? "bg-yellow-500"
                          : event.status === "approved"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
                    >
                      {event.status}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-span-3 space-y-6">
          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${eventTypes[event.type as keyof typeof eventTypes].color}`} />
                  <span className="text-sm truncate">{event.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Pending Approvals</h3>
            <div className="space-y-4">
              {events
                .filter((event) => event.type === "leave" && event.status === "pending")
                .map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{event.driver}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="h-8 bg-secondary text-secondary-foreground hover:bg-secondary/80">
                        Reject
                      </Button>
                      <Button className="h-8">
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <h3 className="font-semibold mb-4">Calendar Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Google Calendar Sync</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Outlook Sync</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Double Booking Alert</span>
                <Switch />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 