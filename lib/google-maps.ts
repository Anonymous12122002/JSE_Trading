import { LoadScriptProps } from "@react-google-maps/api"

export const GOOGLE_MAPS_CONFIG: LoadScriptProps = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: ["places", "directions"] as ("places" | "directions")[],
  id: "google-map-script",
  version: "weekly",
  language: "en",
  region: "US",
}

// Libraries type for TypeScript
export type Libraries = ("places" | "directions")[] 