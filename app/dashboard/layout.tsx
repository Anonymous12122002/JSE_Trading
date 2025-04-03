import type React from "react"
import Link from "next/link"
import {
  BarChart3,
  Bell,
  Calendar,
  CreditCard,
  FileText,
  Home,
  MapPin,
  Menu,
  Search,
  Settings,
  Truck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/dashboard/vehicles"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                  >
                    <Truck className="h-5 w-5" />
                    <span>Vehicles</span>
                  </Link>
                  <Link
                    href="/dashboard/drivers"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                  >
                    <Users className="h-5 w-5" />
                    <span>Drivers</span>
                  </Link>
                  <Link
                    href="/dashboard/trips"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                  >
                    <MapPin className="h-5 w-5" />
                    <span>Trips</span>
                  </Link>
                  <Link
                    href="/dashboard/expenses"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>Expenses</span>
                  </Link>
                  <Link
                    href="/dashboard/reports"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>Reports</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">JSE TRADING</span>
            </Link>
          </div>
          <Link href="/dashboard" className="mr-6 hidden items-center gap-2 md:flex">
            <Truck className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold">JSE TRADING</span>
          </Link>
          <div className="relative hidden md:flex md:grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Sign out</Link>
            </Button>
          </div>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-muted/40 md:block">
          <nav className="grid gap-2 p-4 text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard/vehicles"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Truck className="h-4 w-4" />
              <span>Vehicles</span>
            </Link>
            <Link
              href="/dashboard/drivers"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Users className="h-4 w-4" />
              <span>Drivers</span>
            </Link>
            <Link
              href="/dashboard/trips"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <MapPin className="h-4 w-4" />
              <span>Trips</span>
            </Link>
            <Link
              href="/dashboard/expenses"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <CreditCard className="h-4 w-4" />
              <span>Expenses</span>
            </Link>
            <Link
              href="/dashboard/reports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Reports</span>
            </Link>
            <Link
              href="/dashboard/calendar"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </Link>
            <Link
              href="/dashboard/documents"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

