"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Loader2, Sun, Wind } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type WeatherInfoProps = {
  latitude: number
  longitude: number
  className?: string
}

type WeatherData = {
  temperature: number
  condition: string
  icon: string
  windSpeed: number
  humidity: number
  precipitation: number
  location: string
}

export default function WeatherInfo({ latitude, longitude, className = "" }: WeatherInfoProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      setError(null)

      try {
        // In a real app, you would call your API that interfaces with a weather API
        // For demo purposes, we'll simulate a response
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock weather data
        const mockWeather: WeatherData = {
          temperature: 22,
          condition: "Partly Cloudy",
          icon: "partly-cloudy",
          windSpeed: 12,
          humidity: 65,
          precipitation: 0,
          location: "Johannesburg, South Africa",
        }

        setWeather(mockWeather)
      } catch (err) {
        console.error("Error fetching weather:", err)
        setError("Failed to fetch weather data")
      } finally {
        setLoading(false)
      }
    }

    if (latitude && longitude) {
      fetchWeather()
    }
  }, [latitude, longitude])

  // Function to render weather icon based on condition
  const renderWeatherIcon = () => {
    if (!weather) return <Cloud className="h-8 w-8" />

    switch (weather.icon) {
      case "clear":
        return <Sun className="h-8 w-8 text-yellow-500" />
      case "partly-cloudy":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "cloudy":
        return <Cloud className="h-8 w-8 text-gray-500" />
      case "rain":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      case "drizzle":
        return <CloudDrizzle className="h-8 w-8 text-blue-400" />
      case "thunderstorm":
        return <CloudLightning className="h-8 w-8 text-purple-500" />
      case "snow":
        return <CloudSnow className="h-8 w-8 text-blue-200" />
      case "fog":
        return <CloudFog className="h-8 w-8 text-gray-300" />
      default:
        return <Cloud className="h-8 w-8" />
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle>Weather</CardTitle>
          <CardDescription>Loading current conditions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <CardTitle>Weather</CardTitle>
          <CardDescription>Error loading weather data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!weather) return null

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle>Current Weather</CardTitle>
        <CardDescription>{weather.location}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {renderWeatherIcon()}
            <div>
              <div className="text-2xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm text-muted-foreground">{weather.condition}</div>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4 text-muted-foreground" />
              <span>{weather.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudRain className="h-4 w-4 text-muted-foreground" />
              <span>{weather.precipitation}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-muted-foreground" />
              <span>{weather.humidity}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

