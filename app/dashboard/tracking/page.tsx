"use client"

/// <reference types="@types/google.maps" />
import { useState, useEffect, useRef } from "react"
import {
  MapPin,
  Truck,
  Navigation,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Settings,
  Bell,
  X,
  Clock4,
  Eye,
  User,
  Moon,
  Sun,
  Volume2,
  Map,
  LogOut,
  KeyRound,
  HardDrive,
  Trash2,
  FileDown,
  Link,
  Calendar,
  HelpCircle,
  Phone,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTracking } from "@/contexts/tracking-context"
import { useVehicles } from "@/contexts/vehicle-context"
import GoogleMapComponent from "@/components/maps/google-map"

// Simplified type declarations
declare global {
  interface Window {
    google: any;
  }
}

// Map options interface
interface MapOptions {
  center: { lat: number; lng: number };
  zoom: number;
  mapTypeControl: boolean;
  streetViewControl: boolean;
  fullscreenControl: boolean;
  styles: Array<{
    elementType: string;
    stylers: Array<{ [key: string]: string }>;
  }>;
  gestureHandling: 'cooperative' | 'greedy' | 'none' | 'auto';
}

// Update state types
type GoogleMap = any;
type GoogleMarker = any;
type GoogleInfoWindow = any;

type NotificationType = 'trip' | 'vehicle' | 'driver' | 'system'

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface VehicleLocation {
  vehicleId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
  speed?: number;
  heading?: number;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'trip',
    title: 'New Trip Assigned',
    message: 'You have been assigned to a new trip from Lagos to Abuja',
    timestamp: new Date(),
    read: false,
    priority: 'medium',
    actions: [
      {
        label: 'View Trip',
        action: () => console.log('View trip'),
      },
    ],
  },
  {
    id: '2',
    type: 'vehicle',
    title: 'Vehicle Maintenance Due',
    message: 'Your vehicle is due for maintenance in 3 days',
    timestamp: new Date(),
    read: false,
    priority: 'high',
    actions: [
      {
        label: 'Schedule Maintenance',
        action: () => console.log('Schedule maintenance'),
      },
    ],
  },
  {
    id: '3',
    type: 'system',
    title: 'System Update',
    message: 'A new system update is available',
    timestamp: new Date(),
    read: false,
    priority: 'low',
  },
]

// Update the API key constant
const GOOGLE_MAPS_API_KEY = 'AIzaSyB_-94FKQ0ayRj5Wm16BebAR2NcDJwVAmY'

// Update sound effect path for notifications
const notificationSound = typeof window !== 'undefined' 
  ? new Audio('/notification-2-269292.mp3') 
  : null

// Notification storage key
const STORAGE_KEY = 'fleet_notifications'

interface SettingsState {
  darkMode: boolean
  notificationSound: boolean
  mapTheme: 'light' | 'dark'
}

// Add retry mechanism for loading Google Maps
const loadGoogleMapsWithRetry = (apiKey: string, retries = 3, delay = 2000) => {
  return new Promise<void>((resolve, reject) => {
    const tryLoad = (attemptsLeft: number) => {
      if (window.google) {
        resolve();
        return;
      }

      // Remove any existing Google Maps scripts
      const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      existingScripts.forEach(script => script.remove());

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        console.log('Google Maps script loaded successfully');
        resolve();
      };
      
      script.onerror = (error) => {
        console.error(`Failed to load Google Maps script (attempt ${retries - attemptsLeft + 1}):`, error);
        
        if (attemptsLeft > 0) {
          console.log(`Retrying in ${delay}ms...`);
          setTimeout(() => tryLoad(attemptsLeft - 1), delay);
        } else {
          reject(new Error('Failed to load Google Maps after multiple attempts'));
        }
      };

      document.head.appendChild(script);
    };

    tryLoad(retries);
  });
};

export default function TrackingPage() {
  const { vehicleLocations, isConnected, lastUpdated } = useTracking()
  const { vehicles } = useVehicles()
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<GoogleMap>(null)
  const [markers, setMarkers] = useState<GoogleMarker[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationEnabled, setNotificationEnabled] = useState(true)
  const [settings, setSettings] = useState({
    darkMode: false,
    notificationSound: true,
    mapTheme: 'light' as 'light' | 'dark',
  })
  const [isLoadingMap, setIsLoadingMap] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (map) {
      // Initialize markers for all vehicles
      const newMarkers = vehicles.map((vehicle) => {
        const marker = new google.maps.Marker({
          position: { lat: 0, lng: 0 }, // Default position
          map,
          title: vehicle.name,
          icon: {
            url: '/truck-icon.png',
            scaledSize: new google.maps.Size(32, 32),
          },
        })

        // Add click listener
        marker.addListener('click', () => {
          // Show vehicle info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${vehicle.name}</h3>
                <p>${vehicle.registrationNumber}</p>
                <p>Status: ${vehicle.status}</p>
                <p>Driver: ${vehicle.driver || 'Unassigned'}</p>
              </div>
            `,
          })
          infoWindow.open(map, marker)
        })

        return marker
      })

      setMarkers(newMarkers)
    }
  }, [map, vehicles])

  useEffect(() => {
    if (map && markers.length > 0) {
      // Update marker positions when vehicle locations change
      Object.values(vehicleLocations).forEach((location: { vehicleId: string; coordinates: { lat: number; lng: number } }) => {
        const marker = markers.find((m) => m.getTitle() === location.vehicleId)
        if (marker) {
          marker.setPosition({
            lat: location.coordinates.lat,
            lng: location.coordinates.lng,
          })
        }
      })
    }
  }, [map, markers, vehicleLocations])

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate a refresh operation
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Live Tracking</h2>
          <p className="text-muted-foreground">
            {isConnected ? "Connected to tracking service" : "Disconnected from tracking service"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
          <Badge variant={isConnected ? "default" : "destructive"}>
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="relative w-full overflow-hidden">
            <GoogleMapComponent height="600px" vehicleIds={vehicles.map((v) => v.id)} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{vehicle.name}</CardTitle>
                  <CardDescription>{vehicle.registrationNumber}</CardDescription>
                </div>
                <Badge
                  variant={
                    vehicle.status === "active" ? "default" : vehicle.status === "idle" ? "outline" : "destructive"
                  }
                >
                  {vehicle.status === "active" ? "Active" : vehicle.status === "idle" ? "Idle" : "Maintenance"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">{vehicle.location || "Unknown"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Driver</span>
                  <span className="text-sm font-medium">{vehicle.driver || "Unassigned"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Speed</span>
                  <span className="text-sm font-medium">{vehicle.speed || 0} km/h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">{vehicle.lastUpdated || "Unknown"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 