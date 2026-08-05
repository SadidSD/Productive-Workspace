"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { updatePostStatus } from "@/lib/services/instagram"
import type { IgPostStatus } from "@/lib/services/instagram"
import { StatusBadge } from "./status-badge"

interface QuickStatusSelectorProps {
  postId: string
  currentStatus: IgPostStatus
  onStatusChange?: (newStatus: IgPostStatus) => void
  size?: "sm" | "default" | "icon"
  variant?: "badge" | "button"
}

const STATUS_OPTIONS: { status: IgPostStatus; label: string }[] = [
  { status: "idea", label: "Idea 💡" },
  { status: "scripted", label: "Scripted ✍️" },
  { status: "shot", label: "Shot 🎥" },
  { status: "editing", label: "Editing ✂️" },
  { status: "ready", label: "Ready ✨" },
  { status: "scheduled", label: "Scheduled 📅" },
  { status: "published", label: "Posted 🚀" },
  { status: "missed", label: "Missed ⚠️" },
]

export function QuickStatusSelector({
  postId,
  currentStatus,
  onStatusChange,
  variant = "badge",
}: QuickStatusSelectorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSelect = async (newStatus: IgPostStatus) => {
    if (newStatus === currentStatus) return
    setIsLoading(true)
    try {
      await updatePostStatus(postId, newStatus)
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`)
      if (onStatusChange) {
        onStatusChange(newStatus)
      }
      router.refresh()
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error("Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "badge" ? (
          <button className="cursor-pointer hover:opacity-80 transition-opacity inline-flex items-center gap-1">
            <StatusBadge status={currentStatus} />
            {isLoading ? (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            ) : (
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        ) : (
          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <StatusBadge status={currentStatus} />
                <ChevronDown className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {STATUS_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.status}
            onClick={() => handleSelect(opt.status)}
            className="flex items-center justify-between text-xs cursor-pointer"
          >
            <span>{opt.label}</span>
            {opt.status === currentStatus && <Check className="h-3.5 w-3.5 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
