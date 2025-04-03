"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from "@react-google-maps/api"
import { Loader2 } from "lucide-react"
import { useTracking } from "@/contexts/tracking-context"

const containerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = {
  lat: -26.2041, // Johannesburg
  lng: 28.0473,
}

type MapProps = {
  showDirections?: boolean
  origin?: google.maps.LatLngLiteral
  destination?: google.maps.LatLngLiteral
  waypoints?: google.maps.DirectionsWaypoint[]
  vehicleIds?: string[]
  height?: string
  className?: string
}

export default function GoogleMapComponent({
  showDirections = false,
  origin,
  destination,
  waypoints = [],
  vehicleIds,
  height = "400px",
  className = "",
}: MapProps) {
  const { isLoaded, google } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places", "directions"],
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null)
  const { vehicleLocations } = useTracking()
  const directionsService = useRef<google.maps.DirectionsService | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Calculate directions when props change
  useEffect(() => {
    if (isLoaded && showDirections && origin && destination && google) {
      if (!directionsService.current) {
        directionsService.current = new google.maps.DirectionsService()
      }

      directionsService.current.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result)
          } else {
            console.error(`Directions request failed: ${status}`)
          }
        },
      )
    }
  }, [isLoaded, showDirections, origin, destination, waypoints, google])

  // Filter vehicles to show based on vehicleIds prop
  const filteredVehicles = vehicleIds
    ? Object.entries(vehicleLocations).filter(([id]) => vehicleIds.includes(id))
    : Object.entries(vehicleLocations)

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`} style={{ height }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading map...</span>
      </div>
    )
  }

  return (
    <div className={className} style={{ height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={
          filteredVehicles.length > 0
            ? {
                lat: filteredVehicles[0][1].latitude,
                lng: filteredVehicles[0][1].longitude,
              }
            : defaultCenter
        }
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {/* Render vehicle markers */}
        {filteredVehicles.map(([id, location]) => (
          <Marker
            key={id}
            position={{ lat: location.latitude, lng: location.longitude }}
            icon={{
              url: `/markers/${location.status}.svg`,
              scaledSize: new google.maps.Size(32, 32),
            }}
            onClick={() => setSelectedVehicle(id)}
          />
        ))}

        {/* Render info window for selected vehicle */}
        {selectedVehicle && vehicleLocations[selectedVehicle] && (
          <InfoWindow
            position={{
              lat: vehicleLocations[selectedVehicle].latitude,
              lng: vehicleLocations[selectedVehicle].longitude,
            }}
            onCloseClick={() => setSelectedVehicle(null)}
          >
            <div className="p-2">
              <h3 className="font-medium">Vehicle ID: {selectedVehicle}</h3>
              <p>Speed: {vehicleLocations[selectedVehicle].speed} km/h</p>
              <p>Status: {vehicleLocations[selectedVehicle].status}</p>
              <p>Last updated: {new Date(vehicleLocations[selectedVehicle].timestamp).toLocaleTimeString()}</p>
            </div>
          </InfoWindow>
        )}

        {/* Render directions if available */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#3B82F6",
                strokeWeight: 5,
              },
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}

