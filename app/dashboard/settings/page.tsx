"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useSettings, type UserSettings } from "@/contexts/settings-context"
import {
  Bell,
  Key,
  Lock,
  Mail,
  Moon,
  Palette,
  Settings,
  Sun,
  User,
  Users,
  Wrench,
  Truck,
  Fuel,
  Webhook,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const { user } = useAuth()
  const { settings, loading: settingsLoading, updateSettings } = useSettings()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // User Profile State
  const [profile, setProfile] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
  })

  // App Configuration State
  const [appConfig, setAppConfig] = useState({
    theme: "light",
    emailNotifications: true,
    smsNotifications: false,
    distanceUnit: "km",
    fuelUnit: "liters",
  })

  // Vehicle Settings State
  const [vehicleSettings, setVehicleSettings] = useState({
    maintenanceThreshold: 5000, // km
    fuelEfficiencyTarget: 10, // km/L
    lowFuelAlert: 20, // percentage
  })

  // Integration Settings State
  const [integrationSettings, setIntegrationSettings] = useState({
    googleMapsKey: "",
    paymentGatewayKey: "",
    webhookUrl: "",
  })

  // Initialize state from settings
  useEffect(() => {
    if (settings) {
      setAppConfig({
        theme: settings.theme,
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        distanceUnit: settings.distanceUnit,
        fuelUnit: settings.fuelUnit,
      })

      setVehicleSettings({
        maintenanceThreshold: settings.maintenanceThreshold,
        fuelEfficiencyTarget: settings.fuelEfficiencyTarget,
        lowFuelAlert: settings.lowFuelAlert,
      })

      setIntegrationSettings({
        googleMapsKey: settings.integrations.googleMapsKey || "",
        paymentGatewayKey: settings.integrations.paymentGatewayKey || "",
        webhookUrl: settings.integrations.webhookUrl || "",
      })
    }
  }, [settings])

  const handleProfileUpdate = async () => {
    try {
      setLoading(true)
      setError("")
      // TODO: Implement profile update logic
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleConfigUpdate = async () => {
    try {
      setLoading(true)
      setError("")
      
      await updateSettings({
        theme: appConfig.theme as UserSettings["theme"],
        emailNotifications: appConfig.emailNotifications,
        smsNotifications: appConfig.smsNotifications,
        distanceUnit: appConfig.distanceUnit as UserSettings["distanceUnit"],
        fuelUnit: appConfig.fuelUnit as UserSettings["fuelUnit"],
        maintenanceThreshold: vehicleSettings.maintenanceThreshold,
        fuelEfficiencyTarget: vehicleSettings.fuelEfficiencyTarget,
        lowFuelAlert: vehicleSettings.lowFuelAlert,
        integrations: {
          googleMapsKey: integrationSettings.googleMapsKey,
          paymentGatewayKey: integrationSettings.paymentGatewayKey,
          webhookUrl: integrationSettings.webhookUrl,
        },
      })

      toast({
        title: "Settings Updated",
        description: "Your settings have been updated successfully.",
      })
    } catch (error) {
      setError("Failed to update settings. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (settingsLoading) {
    return (
      <div className="flex h-[450px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            User Profile
          </TabsTrigger>
          <TabsTrigger value="app" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            App Settings
          </TabsTrigger>
          <TabsTrigger value="vehicle" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Vehicle Settings
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Webhook className="h-4 w-4" />
            Integration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Manage your personal information and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Change Password</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={profile.currentPassword}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={profile.newPassword}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={profile.confirmPassword}
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="2fa"
                    checked={profile.twoFactorEnabled}
                    onCheckedChange={(checked: boolean) =>
                      setProfile((prev) => ({
                        ...prev,
                        twoFactorEnabled: checked,
                      }))
                    }
                  />
                  <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>
                Customize your app experience and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred theme
                    </p>
                  </div>
                  <Select
                    value={appConfig.theme}
                    onValueChange={(value: string) =>
                      setAppConfig((prev) => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="emailNotifications"
                      checked={appConfig.emailNotifications}
                      onCheckedChange={(checked: boolean) =>
                        setAppConfig((prev) => ({
                          ...prev,
                          emailNotifications: checked,
                        }))
                      }
                    />
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="smsNotifications"
                      checked={appConfig.smsNotifications}
                      onCheckedChange={(checked: boolean) =>
                        setAppConfig((prev) => ({
                          ...prev,
                          smsNotifications: checked,
                        }))
                      }
                    />
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Units</h4>
                  <div className="grid gap-2">
                    <Label htmlFor="distanceUnit">Distance Unit</Label>
                    <Select
                      value={appConfig.distanceUnit}
                      onValueChange={(value: string) =>
                        setAppConfig((prev) => ({ ...prev, distanceUnit: value }))
                      }
                    >
                      <SelectTrigger id="distanceUnit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">Kilometers (km)</SelectItem>
                        <SelectItem value="miles">Miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fuelUnit">Fuel Unit</Label>
                    <Select
                      value={appConfig.fuelUnit}
                      onValueChange={(value: string) =>
                        setAppConfig((prev) => ({ ...prev, fuelUnit: value }))
                      }
                    >
                      <SelectTrigger id="fuelUnit">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleConfigUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="vehicle">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Settings</CardTitle>
              <CardDescription>
                Configure vehicle-related settings and thresholds.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="maintenanceThreshold">
                    Maintenance Reminder Threshold (km)
                  </Label>
                  <Input
                    id="maintenanceThreshold"
                    type="number"
                    value={vehicleSettings.maintenanceThreshold}
                    onChange={(e) =>
                      setVehicleSettings((prev) => ({
                        ...prev,
                        maintenanceThreshold: parseInt(e.target.value),
                      }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Remind when vehicle reaches this mileage after last maintenance
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fuelEfficiencyTarget">
                    Fuel Efficiency Target (km/L)
                  </Label>
                  <Input
                    id="fuelEfficiencyTarget"
                    type="number"
                    value={vehicleSettings.fuelEfficiencyTarget}
                    onChange={(e) =>
                      setVehicleSettings((prev) => ({
                        ...prev,
                        fuelEfficiencyTarget: parseInt(e.target.value),
                      }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Target fuel efficiency for your fleet
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="lowFuelAlert">Low Fuel Alert (%)</Label>
                  <Input
                    id="lowFuelAlert"
                    type="number"
                    value={vehicleSettings.lowFuelAlert}
                    onChange={(e) =>
                      setVehicleSettings((prev) => ({
                        ...prev,
                        lowFuelAlert: parseInt(e.target.value),
                      }))
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Alert when fuel level falls below this percentage
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleConfigUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integration">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Configure third-party service integrations and API keys.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="googleMapsKey">Google Maps API Key</Label>
                  <Input
                    id="googleMapsKey"
                    type="password"
                    value={integrationSettings.googleMapsKey}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        googleMapsKey: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="paymentGatewayKey">Payment Gateway API Key</Label>
                  <Input
                    id="paymentGatewayKey"
                    type="password"
                    value={integrationSettings.paymentGatewayKey}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        paymentGatewayKey: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    value={integrationSettings.webhookUrl}
                    onChange={(e) =>
                      setIntegrationSettings((prev) => ({
                        ...prev,
                        webhookUrl: e.target.value,
                      }))
                    }
                    placeholder="https://your-webhook-url.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    URL to receive webhook notifications
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleConfigUpdate} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 