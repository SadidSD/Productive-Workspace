"use client"

import * as React from "react"
import { format } from "date-fns"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import type { EngagementCheck } from "@/lib/services/instagram"
import { upsertEngagementCheck } from "@/lib/services/instagram"

interface EngagementChecklistProps {
  workspaceId: string
  initialChecks: EngagementCheck[]
}

export function EngagementChecklist({ workspaceId, initialChecks }: EngagementChecklistProps) {
  const todayDateStr = format(new Date(), "yyyy-MM-dd")
  const todayCheck = initialChecks.find(c => c.check_date === todayDateStr)

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

  const completedCount = Object.values(checks).filter(Boolean).length
  const totalCount = Object.keys(checks).length
  const progressPercent = (completedCount / totalCount) * 100

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Daily Engagement</span>
          <span className="text-muted-foreground text-xs font-normal">
            {format(new Date(), "MMM d, yyyy")}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{completedCount}/{totalCount} tasks completed</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="space-y-3 pt-2">
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="task1" 
              checked={checks.engaged_tcg_content}
              onCheckedChange={(c) => handleToggle('engaged_tcg_content', c as boolean)}
            />
            <Label htmlFor="task1" className="text-xs leading-snug font-normal cursor-pointer">
              Engaged with TCG content (15-20 likes, 3-5 comments)
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="task2" 
              checked={checks.replied_comments_dms}
              onCheckedChange={(c) => handleToggle('replied_comments_dms', c as boolean)}
            />
            <Label htmlFor="task2" className="text-xs leading-snug font-normal cursor-pointer">
              Replied to ALL comments and DMs
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="task3" 
              checked={checks.dmed_store_owners}
              onCheckedChange={(c) => handleToggle('dmed_store_owners', c as boolean)}
            />
            <Label htmlFor="task3" className="text-xs leading-snug font-normal cursor-pointer">
              DM'd 2-3 TCG store owners
            </Label>
          </div>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="task4" 
              checked={checks.watched_tcg_reels}
              onCheckedChange={(c) => handleToggle('watched_tcg_reels', c as boolean)}
            />
            <Label htmlFor="task4" className="text-xs leading-snug font-normal cursor-pointer">
              Watched TCG Reels for research (saved 3-5)
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
