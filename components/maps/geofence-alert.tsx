"use client"

import { useState, useEffect } from "react"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useTracking } from "@/contexts/tracking-context"
import type { LatLngLiteral } from "@/types"

type GeofenceAlertProps = {
  vehicleId: string
  routeCoordinates: LatLngLiteral[]
  maxDistanceMeters?: number
  onDismiss?: () => void
}

export default function GeofenceAlert({
  vehicleId,
  routeCoordinates,
  maxDistanceMeters = 500,
  onDismiss,
}: GeofenceAlertProps) {
  const { vehicleLocations } = useTracking()
  const [isOutsideRoute, setIsOutsideRoute] = useState(false)
  const [distanceFromRoute, setDistanceFromRoute] = useState(0)

  useEffect(() => {
    // Check if the vehicle exists in tracking data
    if (!vehicleLocations[vehicleId] || routeCoordinates.length === 0) {
      return
    }

    // Get current vehicle location
    const vehicleLocation = {
      lat: vehicleLocations[vehicleId].latitude,
      lng: vehicleLocations[vehicleId].longitude,
    }

    // Calculate minimum distance from route
    let minDistance = Number.MAX_VALUE

    // For each segment of the route, calculate distance from point to line
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const start = routeCoordinates[i]
      const end = routeCoordinates[i + 1]

      // Calculate distance from point to line segment
      const distance = distanceToLineSegment(
        start.lat,
        start.lng,
        end.lat,
        end.lng,
        vehicleLocation.lat,
        vehicleLocation.lng,
      )

      minDistance = Math.min(minDistance, distance)
    }

    // Convert to meters (approximate)
    const distanceInMeters = minDistance * 111319.9

    setDistanceFromRoute(Math.round(distanceInMeters))
    setIsOutsideRoute(distanceInMeters > maxDistanceMeters)
  }, [vehicleLocations, vehicleId, routeCoordinates, maxDistanceMeters])

  // If not outside route, don't show alert
  if (!isOutsideRoute) {
    return null
  }

  return (
    <Alert variant="destructive" className="relative">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Vehicle Off Route</AlertTitle>
      <AlertDescription>
        Vehicle {vehicleId} is approximately {distanceFromRoute} meters away from the planned route.
      </AlertDescription>
      {onDismiss && (
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={onDismiss}>
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}

// Helper function to calculate distance from point to line segment
function distanceToLineSegment(x1: number, y1: number, x2: number, y2: number, x0: number, y0: number): number {
  const A = x0 - x1
  const B = y0 - y1
  const C = x2 - x1
  const D = y2 - y1

  const dot = A * C + B * D
  const len_sq = C * C + D * D
  let param = -1

  if (len_sq !== 0) {
    param = dot / len_sq
  }

  let xx, yy

  if (param < 0) {
    xx = x1
    yy = y1
  } else if (param > 1) {
    xx = x2
    yy = y2
  } else {
    xx = x1 + param * C
    yy = y1 + param * D
  }

  const dx = x0 - xx
  const dy = y0 - yy

  return Math.sqrt(dx * dx + dy * dy)
}

