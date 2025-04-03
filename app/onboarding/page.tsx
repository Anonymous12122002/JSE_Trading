import Link from "next/link"
import { ArrowRight, CheckCircle2, Truck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle>Step 1: Account Created</CardTitle>
              <CardDescription>Your account has been successfully created</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>You've completed the first step by creating your account. Now let's set up your vehicles and drivers.</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Truck className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle>Step 2: Add Vehicles</CardTitle>
              <CardDescription>Register your vehicles for tracking</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>Add your vehicles with their details to start tracking their trips and performance.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/onboarding/vehicles">
                Continue to Vehicles <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <CardTitle>Step 3: Add Drivers</CardTitle>
              <CardDescription>Register your drivers</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p>Add your drivers with their contact information to assign them to vehicles and trips.</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/onboarding/drivers">
                Skip to Drivers <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button asChild variant="ghost">
          <Link href="/dashboard">Skip Onboarding</Link>
        </Button>
      </div>
    </div>
  )
}

