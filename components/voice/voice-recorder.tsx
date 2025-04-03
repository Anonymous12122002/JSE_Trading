"use client"

import { useState, useRef, useEffect } from "react"
import { Mic, Square, Loader2, Play, Pause, Save, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

type VoiceRecorderProps = {
  onSave: (url: string) => void
  tripId?: string
  maxDuration?: number // in seconds
}

export default function VoiceRecorder({ onSave, tripId = "new", maxDuration = 60 }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Set up audio element
  useEffect(() => {
    audioRef.current = new Audio()
    audioRef.current.addEventListener("ended", () => {
      setIsPlaying(false)
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [])

  // Update recording time
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording, maxDuration])

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startRecording = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)

        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)

        // Set audio source
        if (audioRef.current) {
          audioRef.current.src = audioUrl
        }

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (err) {
      console.error("Error starting recording:", err)
      setError("Could not access microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const saveRecording = async () => {
    if (!audioBlob) return

    setIsUploading(true)
    setError(null)

    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, `trips/${tripId}/voice-note-${Date.now()}.webm`)

      // Upload the file
      await uploadBytes(storageRef, audioBlob)

      // Get the download URL
      const downloadUrl = await getDownloadURL(storageRef)

      // Call the onSave callback with the URL
      onSave(downloadUrl)

      // Reset state
      setAudioBlob(null)
      setAudioUrl(null)
    } catch (err) {
      console.error("Error uploading voice note:", err)
      setError("Failed to upload voice note. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const discardRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }

    setAudioBlob(null)
    setAudioUrl(null)
    setIsPlaying(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Voice Note</div>
        {isRecording && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
            <span className="text-sm">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!audioBlob ? (
          <>
            {isRecording ? (
              <Button type="button" variant="destructive" size="sm" onClick={stopRecording}>
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button type="button" variant="outline" size="sm" onClick={startRecording}>
                <Mic className="mr-2 h-4 w-4" />
                Record Voice Note
              </Button>
            )}
          </>
        ) : (
          <>
            <Button type="button" variant="outline" size="sm" onClick={togglePlayback}>
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </>
              )}
            </Button>

            <Button type="button" variant="default" size="sm" onClick={saveRecording} disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>

            <Button type="button" variant="outline" size="sm" onClick={discardRecording} disabled={isUploading}>
              <Trash className="mr-2 h-4 w-4" />
              Discard
            </Button>
          </>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

