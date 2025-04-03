import Image from "next/image"
import Link from "next/link"
import { Truck } from "lucide-react"
import LoginForm from "./login-form"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left side - Login form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Truck className="h-10 w-10 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-primary">JSE TRADING</h1>
            </div>
            <h2 className="mt-6 text-xl font-semibold tracking-tight">Sign in to your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">Access your vehicle tracking dashboard</p>
          </div>

          <div className="mt-8">
            <LoginForm />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-muted-foreground">New to JSE TRADING?</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/register" className="text-sm font-medium text-primary hover:underline">
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden flex-1 md:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="/placeholder.svg?height=1080&width=1920"
          alt="Vehicle tracking system"
          width={1920}
          height={1080}
          priority
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-3xl font-bold">Real-time Vehicle Tracking</h2>
          <p className="mt-4 max-w-md text-center text-lg">
            Monitor your fleet in real-time with our advanced GPS tracking system
          </p>
        </div>
      </div>
    </div>
  )
}

