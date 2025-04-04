"use client"

import { useEffect, useRef, useState } from "react"
import { Search, MapPin, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useJsApiLoader } from "@react-google-maps/api"
import { GOOGLE_MAPS_CONFIG } from "@/lib/google-maps"

type LocationInputProps = {
  value: string
  onChange: (value: string, placeDetails?: google.maps.places.PlaceResult) => void
  placeholder?: string
  className?: string
  useCurrentLocation?: boolean
}

export default function LocationInput({
  value,
  onChange,
  placeholder = "Enter location",
  className = "",
  useCurrentLocation = false,
}: LocationInputProps) {
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_CONFIG)

  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  useEffect(() => {
    if (isLoaded && inputRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode", "establishment"],
        fields: ["address_components", "formatted_address", "geometry", "name"],
      })

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current?.getPlace()
        if (place && place.formatted_address) {
          onChange(place.formatted_address, place)
        }
      })
    }
  }, [isLoaded, onChange])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingCurrentLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Use Geocoding API to get address from coordinates
          const geocoder = new google.maps.Geocoder()
          geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            setIsLoadingCurrentLocation(false)
            if (status === "OK" && results && results[0]) {
              const address = results[0].formatted_address
              onChange(address, results[0])
            } else {
              console.error("Geocoder failed due to: " + status)
            }
          })
        },
        (error) => {
          setIsLoadingCurrentLocation(false)
          console.error("Error getting current location:", error)
        },
      )
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 pr-10"
        disabled={!isLoaded}
      />
      {useCurrentLocation && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0"
          onClick={getCurrentLocation}
          disabled={isLoadingCurrentLocation || !isLoaded}
        >
          {isLoadingCurrentLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        </Button>
      )}
    </div>
  )
}

