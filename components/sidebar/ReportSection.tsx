"use client"

import { useState, useMemo } from "react"
import { ChevronDown, ChevronRight, FileText, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { downloadReport, type ReportType } from "@/lib/reports"
import { Input } from "@/components/ui/input"

interface ReportItem {
  id: string
  title: string
  type: ReportType
}

interface ReportSectionProps {
  title: string
  items: ReportItem[]
  onDownload: (type: string) => Promise<void>
}

const reportItems: ReportItem[] = [
  { id: "1", title: "Data Export", type: "maintenance" },
  { id: "2", title: "Monthly Cost Review Report", type: "monthly-cost" },
  { id: "4", title: "Summary of Pending Pickups", type: "pending-pickups-detail" },
  { id: "5", title: "Detail View of Pending Pickups", type: "pending-pickups-summary" },
  { id: "6", title: "Transporter Payments", type: "fuel-consumption" },
  { id: "7", title: "Exports Payments Report", type: "maintenance" },
  { id: "8", title: "Pickup Drop Location Report", type: "vehicle-performance" },
  { id: "9", title: "Pickup Cost History", type: "driver-performance" },
]

export function ReportSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [loadingReport, setLoadingReport] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter reports based on search query
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reportItems
    const query = searchQuery.toLowerCase()
    return reportItems.filter(item => 
      item.title.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const handleKeyDown = (e: React.KeyboardEvent, itemId?: string) => {
    switch (e.key) {
      case "Enter":
        if (itemId) {
          handleReportClick(itemId)
        } else {
          setIsExpanded(!isExpanded)
        }
        break
      case "ArrowRight":
        !isExpanded && setIsExpanded(true)
        break
      case "ArrowLeft":
        isExpanded && setIsExpanded(false)
        break
      case "ArrowDown":
        if (isExpanded && itemId) {
          const currentIndex = filteredReports.findIndex(item => item.id === itemId)
          const nextItem = filteredReports[currentIndex + 1]
          if (nextItem) {
            setActiveItem(nextItem.id)
          }
        }
        break
      case "ArrowUp":
        if (isExpanded && itemId) {
          const currentIndex = filteredReports.findIndex(item => item.id === itemId)
          const prevItem = filteredReports[currentIndex - 1]
          if (prevItem) {
            setActiveItem(prevItem.id)
          }
        }
        break
    }
  }

  const handleReportClick = async (itemId: string) => {
    const report = reportItems.find(item => item.id === itemId)
    if (!report || loadingReport) return

    // Handle Data Export navigation
    if (report.id === "1") {
      window.location.href = "/dashboard/data-export"
      return
    }

    setLoadingReport(itemId)
    try {
      await downloadReport(report.type)
    } catch (error) {
      console.error("Error downloading report:", error)
    } finally {
      setLoadingReport(null)
    }
  }

  // Auto-expand when searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value && !isExpanded) {
      setIsExpanded(true)
    }
  }

  return (
    <div className="py-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => handleKeyDown(e)}
        className={cn(
          "flex w-full items-center gap-2 rounded-lg px-3 py-2",
          "text-sm font-medium",
          "hover:bg-accent hover:text-accent-foreground",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        aria-expanded={isExpanded}
        tabIndex={0}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
        <FileText className="h-4 w-4" />
        <span>Reports</span>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-1 pl-6 mt-1">
          <div className="px-3 mb-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-8 h-9"
              />
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No reports found
            </div>
          ) : (
            filteredReports.map((item) => (
              <button
                key={item.id}
                onClick={() => handleReportClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2",
                  "text-sm text-muted-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeItem === item.id && "bg-accent text-accent-foreground"
                )}
                disabled={loadingReport !== null}
                tabIndex={isExpanded ? 0 : -1}
              >
                {loadingReport === item.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>{item.title}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 