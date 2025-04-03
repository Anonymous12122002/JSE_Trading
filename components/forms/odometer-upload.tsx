"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Camera, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

type OdometerUploadProps = {
  value: string
  onChange: (url: string) => void
  label: string
  tripId?: string
  type: "start" | "end"
}

export default function OdometerUpload({ value, onChange, label, tripId = "new", type }: OdometerUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }

      setIsUploading(true)
      setError(null)

      try {
        // Create a reference to the storage location
        const storageRef = ref(storage, `trips/${tripId}/odometer-${type}-${Date.now()}`)

        // Upload the file
        await uploadBytes(storageRef, file)

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef)

        // Call the onChange callback with the URL
        onChange(downloadUrl)
      } catch (err) {
        console.error("Error uploading file:", err)
        setError("Failed to upload image. Please try again.")
      } finally {
        setIsUploading(false)
      }
    },
    [tripId, type, onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {value ? (
        <div className="relative rounded-md border overflow-hidden">
          <img
            src={value || "/placeholder.svg"}
            alt={`${type} odometer reading`}
            className="w-full h-40 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-4">
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                {isDragActive ? "Drop the image here" : "Take a photo or upload an image"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG or WebP, max 5MB</p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

