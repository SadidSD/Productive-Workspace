"use client"

import * as React from "react"
import { format } from "date-fns"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckSquare, RotateCcw, Flame, Sparkles } from "lucide-react"
import { toast } from "sonner"
import type { EngagementCheck } from "@/lib/services/instagram"
import { upsertEngagementCheck } from "@/lib/services/instagram"

interface EngagementChecklistProps {
  workspaceId: string
  initialChecks: EngagementCheck[]
}

export function EngagementChecklist({ workspaceId, initialChecks }: EngagementChecklistProps) {
  const todayDateStr = format(new Date(), "yyyy-MM-dd")
  const todayCheck = initialChecks.find((c) => c.check_date === todayDateStr)

  const [checks, setChecks] = React.useState({
    engaged_tcg_content: todayCheck?.engaged_tcg_content ?? false,
    replied_comments_dms: todayCheck?.replied_comments_dms ?? false,
    dmed_store_owners: todayCheck?.dmed_store_owners ?? false,
    watched_tcg_reels: todayCheck?.watched_tcg_reels ?? false,
  })

  const handleToggle = async (key: keyof typeof checks, checked: boolean) => {
    const newChecks = { ...checks, [key]: checked }
    setChecks(newChecks)
    try {
      await upsertEngagementCheck(workspaceId, todayDateStr, { [key]: checked })
    } catch (error) {
      console.error("Failed to update engagement check", error)
      setChecks(checks)
    }
  }

  const handleReset = async () => {
    const resetValues = {
      engaged_tcg_content: false,
      replied_comments_dms: false,
      dmed_store_owners: false,
      watched_tcg_reels: false,
    }
    setChecks(resetValues)
    try {
      await upsertEngagementCheck(workspaceId, todayDateStr, resetValues)
      toast.success("Today's checklist reset.")
    } catch (error) {
      console.error("Failed to reset checklist", error)
      toast.error("Failed to reset checklist")
    }
  }

  const completedCount = Object.values(checks).filter(Boolean).length
  const totalCount = Object.keys(checks).length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-semibold flex justify-between items-center">
          <span className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            📝 Daily Engagement Checklist
          </span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {format(new Date(), "MMM d, yyyy")}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 flex-1 flex flex-col justify-between">
        {/* Habit Tasks */}
        <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/40">
          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="task1"
              checked={checks.engaged_tcg_content}
              onCheckedChange={(c) => handleToggle("engaged_tcg_content", !!c)}
              className="mt-0.5"
            />
            <Label htmlFor="task1" className="text-xs leading-snug font-normal cursor-pointer">
              <span className="font-medium text-foreground">Engaged with TCG content</span>
              <span className="block text-[11px] text-muted-foreground">15-20 likes, 3-5 comments</span>
            </Label>
          </div>

          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="task2"
              checked={checks.replied_comments_dms}
              onCheckedChange={(c) => handleToggle("replied_comments_dms", !!c)}
              className="mt-0.5"
            />
            <Label htmlFor="task2" className="text-xs leading-snug font-normal cursor-pointer">
              <span className="font-medium text-foreground">Replied to ALL comments and DMs</span>
              <span className="block text-[11px] text-muted-foreground">Build warm audience relationships</span>
            </Label>
          </div>

          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="task3"
              checked={checks.dmed_store_owners}
              onCheckedChange={(c) => handleToggle("dmed_store_owners", !!c)}
              className="mt-0.5"
            />
            <Label htmlFor="task3" className="text-xs leading-snug font-normal cursor-pointer">
              <span className="font-medium text-foreground">DM&apos;d 2-3 TCG store owners</span>
              <span className="block text-[11px] text-muted-foreground">Direct founder outreach</span>
            </Label>
          </div>

          <div className="flex items-start space-x-2.5">
            <Checkbox
              id="task4"
              checked={checks.watched_tcg_reels}
              onCheckedChange={(c) => handleToggle("watched_tcg_reels", !!c)}
              className="mt-0.5"
            />
            <Label htmlFor="task4" className="text-xs leading-snug font-normal cursor-pointer">
              <span className="font-medium text-foreground">Watched TCG Reels (saved 3-5)</span>
              <span className="block text-[11px] text-muted-foreground">Research & market warming</span>
            </Label>
          </div>
        </div>

        {/* Progress & Reset Footer */}
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-medium flex items-center gap-1">
                {progressPercent === 100 ? (
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                )}
                <span>Progress: <strong className="text-foreground">{completedCount}/{totalCount}</strong> ({progressPercent}%)</span>
              </span>
              <span className="text-muted-foreground text-[11px]">
                {progressPercent === 100 ? "🎉 Daily habit win!" : "Daily Target"}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="text-[11px] text-muted-foreground">Auto-saved daily</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-6 text-[11px] text-muted-foreground hover:text-foreground gap-1 px-2"
            >
              <RotateCcw className="h-3 w-3" />
              Reset Today
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
