"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, IndianRupee, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface ExpenseItem {
  id: string
  title: string
  path: string
}

const expenseItems: ExpenseItem[] = [
  { id: "1", title: "All Expenses", path: "/dashboard/expenses" },
  { id: "2", title: "Fuel Expenses", path: "/dashboard/expenses/fuel" },
  { id: "3", title: "Maintenance Costs", path: "/dashboard/expenses/maintenance" },
  { id: "4", title: "Driver Allowances", path: "/dashboard/expenses/allowances" },
  { id: "5", title: "Toll Payments", path: "/dashboard/expenses/tolls" },
  { id: "6", title: "Add New Expense", path: "/dashboard/expenses/new" },
]

export function ExpensesSection() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Filter expenses based on search query
  const filteredExpenses = searchQuery.trim()
    ? expenseItems.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : expenseItems

  // Auto-expand when searching
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value && !isExpanded) {
      setIsExpanded(true)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, itemId?: string) => {
    switch (e.key) {
      case "Enter":
        if (itemId) {
          const item = expenseItems.find(i => i.id === itemId)
          if (item) {
            window.location.href = item.path
          }
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
          const currentIndex = filteredExpenses.findIndex(item => item.id === itemId)
          const nextItem = filteredExpenses[currentIndex + 1]
          if (nextItem) {
            setActiveItem(nextItem.id)
          }
        } else if (isExpanded) {
          setActiveItem(filteredExpenses[0]?.id || null)
        }
        break
      case "ArrowUp":
        if (isExpanded && itemId) {
          const currentIndex = filteredExpenses.findIndex(item => item.id === itemId)
          const prevItem = filteredExpenses[currentIndex - 1]
          if (prevItem) {
            setActiveItem(prevItem.id)
          }
        }
        break
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
        <IndianRupee className="h-4 w-4" />
        <span>Expenses</span>
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
                placeholder="Search expenses..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-8 h-9"
              />
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No expenses found
            </div>
          ) : (
            filteredExpenses.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2",
                  "text-sm text-muted-foreground",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  activeItem === item.id && "bg-accent text-accent-foreground"
                )}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                tabIndex={isExpanded ? 0 : -1}
                onClick={() => setActiveItem(item.id)}
              >
                <IndianRupee className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 