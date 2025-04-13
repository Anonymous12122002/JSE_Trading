import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Truck,
  Route,
  Fuel,
  IndianRupee,
  ChevronRight,
  Users,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  X,
  Gauge,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export type StatsCardProps = {
  type: "vehicles" | "trips" | "fuel" | "expenses"
  title: string
  value: string
  subtitle: string
  details: {
    [key: string]: string
  }
  vehicleFuelData?: {
    name: string
    consumption: number
    efficiency: number
    cost: number
  }[]
}

export function StatsCard({ type, title, value, subtitle, details, vehicleFuelData }: StatsCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const icons = {
    vehicles: Truck,
    trips: Route,
    fuel: Fuel,
    expenses: IndianRupee,
  }

  const Icon = icons[type]

  const getDetailIcon = (key: string) => {
    const iconMap: { [key: string]: any } = {
      active: Truck,
      idle: Clock,
      maintenance: AlertTriangle,
      completed: CheckCircle2,
      pending: Clock,
      cancelled: X,
      "total distance": Route,
      "average speed": Gauge,
      "fuel efficiency": Fuel,
      "total cost": IndianRupee,
      "cost per km": IndianRupee,
      "last refuel": Calendar,
      location: MapPin,
      driver: Users,
    }
    
    const matchedKey = Object.keys(iconMap).find(k => 
      key.toLowerCase().includes(k.toLowerCase())
    )
    
    return matchedKey ? iconMap[matchedKey] : ChevronRight
  }

  return (
    <>
      <Card
        className={cn(
          "relative overflow-hidden transition-all hover:shadow-md cursor-pointer",
          "hover:scale-[1.02] active:scale-[0.98]"
        )}
        onClick={() => setShowDetails(true)}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{value}</span>
              </div>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <div className="rounded-full p-2 bg-background/10">
              <Icon className="h-4 w-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5" />
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {type === "fuel" && vehicleFuelData && (
              <div className="mt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vehicleFuelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                      <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="consumption" name="Fuel Consumption (L)" fill="#3B82F6" />
                      <Bar yAxisId="right" dataKey="efficiency" name="Efficiency (km/L)" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {vehicleFuelData.map((vehicle) => (
                    <div key={vehicle.name} className="rounded-lg border p-2">
                      <div className="text-sm font-medium">{vehicle.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Consumption: {vehicle.consumption}L
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Efficiency: {vehicle.efficiency} km/L
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cost: ₹{vehicle.cost}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {showDetails && (
              <div className="mt-4 space-y-2">
                {Object.entries(details).map(([key, value]) => {
                  const DetailIcon = getDetailIcon(key)
                  return (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <DetailIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{key}</span>
                      </div>
                      <span className="font-medium">{value}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide Details" : "Show Details"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
} 