"use client"

import * as React from "react"
import { format, nextMonday, addDays, startOfToday } from "date-fns"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { createInstagramPost } from "@/lib/services/instagram"
import { CalendarDays, Loader2, AlertTriangle } from "lucide-react"
import type { IgContentPillar, IgFunnelStage } from "@/lib/services/instagram"

interface TemplatePost {
  title: string
  pillar: IgContentPillar
  funnel_stage: IgFunnelStage
}

const TEMPLATE_DATA: TemplatePost[] = [
  // Month 1
  { title: "TCGplayer fees are stealing your profit", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "5 signs you've outgrown TCGplayer", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "TCG store owners: Stop overselling", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "TCGplayer's Pro Website: The trap", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "How to calculate your TCG fee costs", pillar: "education", funnel_stage: "awareness" },
  { title: "Why your TCG store is losing money", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "TCG inventory management nightmare", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "Manual listing vs AI automation", pillar: "comparison", funnel_stage: "awareness" },
  { title: "TCG store burnout: Stop working 80 hours", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "TCG account suspension: Real story", pillar: "platform_pain", funnel_stage: "awareness" },
  { title: "Multi-channel sync failure explained", pillar: "education", funnel_stage: "awareness" },
  { title: "Is TCGplayer owning your business?", pillar: "platform_pain", funnel_stage: "awareness" },
  
  // Month 2
  { title: "Watch AI list 100 cards in 30 seconds", pillar: "solution", funnel_stage: "education" },
  { title: "How a custom website saves TCG fees", pillar: "solution", funnel_stage: "education" },
  { title: "The TCG store technology stack", pillar: "education", funnel_stage: "education" },
  { title: "Shopify vs Custom for TCG", pillar: "comparison", funnel_stage: "education" },
  { title: "Real-time sync: TCGplayer ↔ Website", pillar: "solution", funnel_stage: "education" },
  { title: "TCG buylist automation explained", pillar: "solution", funnel_stage: "education" },
  { title: "TCG industry trends 2026", pillar: "education", funnel_stage: "education" },
  { title: "How to start a TCG store (tech guide)", pillar: "education", funnel_stage: "education" },
  { title: "TCG website must-have features", pillar: "education", funnel_stage: "education" },
  { title: "Inventory management for TCG stores", pillar: "solution", funnel_stage: "education" },
  { title: "TCG pricing automation: How it works", pillar: "solution", funnel_stage: "education" },
  { title: "Customer experience in TCG stores", pillar: "education", funnel_stage: "education" },
  
  // Month 3
  { title: "This TCG store saved $30,000/year", pillar: "case_study", funnel_stage: "trust" },
  { title: "TCG store automation: Real results", pillar: "case_study", funnel_stage: "trust" },
  { title: "Client testimonial: Why they built custom", pillar: "case_study", funnel_stage: "trust" },
  { title: "TCG store before vs after redesign", pillar: "case_study", funnel_stage: "trust" },
  { title: "How this store grew 300% in 1 year", pillar: "case_study", funnel_stage: "trust" },
  { title: "TCG website: The ROI breakdown", pillar: "case_study", funnel_stage: "trust" },
  { title: "SortSwift vs TCG Sync vs Custom", pillar: "comparison", funnel_stage: "trust" },
  { title: "TCG tools comparison 2026", pillar: "comparison", funnel_stage: "trust" },
  { title: "Why TCG store owners choose custom websites", pillar: "case_study", funnel_stage: "trust" },
  { title: "3 TCG stores I built this year", pillar: "case_study", funnel_stage: "conversion" },
  { title: "I build TCG websites. Here's why.", pillar: "case_study", funnel_stage: "conversion" },
  { title: "DM me 'TCG' for a free audit", pillar: "case_study", funnel_stage: "conversion" }
]

interface NinetyDayTemplateProps {
  workspaceId: string
  existingPostCount: number
}

export function NinetyDayTemplate({ workspaceId, existingPostCount }: NinetyDayTemplateProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [isPopulating, setIsPopulating] = React.useState(false)

  const handlePopulate = async () => {
    try {
      setIsPopulating(true)
      
      const startDay = nextMonday(startOfToday())
      
      for (let i = 0; i < TEMPLATE_DATA.length; i++) {
        const item = TEMPLATE_DATA[i]
        const weekIndex = Math.floor(i / 3)
        const dayInWeek = i % 3
        
        let daysToAdd = weekIndex * 7
        if (dayInWeek === 1) daysToAdd += 2
        if (dayInWeek === 2) daysToAdd += 4
        
        const scheduledDate = format(addDays(startDay, daysToAdd), "yyyy-MM-dd")
        
        await createInstagramPost(workspaceId, {
          title: item.title,
          pillar: item.pillar,
          funnel_stage: item.funnel_stage,
          format: 'reel',
          status: 'idea',
          cta: 'DM me "TCG" to see how I can help.',
          scheduled_date: scheduledDate
        })
      }
      
      toast.success("90-day content plan generated successfully.")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to populate 90-day plan", error)
      toast.error("Failed to generate plan.")
    } finally {
      setIsPopulating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CalendarDays className="h-4 w-4" />
          Apply 90-Day Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Apply 90-Day Plan</DialogTitle>
          <DialogDescription>
            This will auto-populate your calendar with 36 proven reel ideas over 12 weeks, scheduled for Mon/Wed/Fri.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4 space-y-2 text-sm">
            <p><strong>Month 1:</strong> Awareness & Pain Points</p>
            <p><strong>Month 2:</strong> Solution & Education</p>
            <p><strong>Month 3:</strong> Case Studies & Conversion</p>
          </div>
          
          {existingPostCount > 0 && (
            <div className="flex items-start gap-2 text-amber-600 bg-amber-50 dark:bg-amber-950/50 p-3 rounded-md border border-amber-200 dark:border-amber-900">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <p className="text-sm leading-snug">
                You already have {existingPostCount} posts in your planner. Adding this template might cause overlap on some dates.
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPopulating}>
            Cancel
          </Button>
          <Button onClick={handlePopulate} disabled={isPopulating}>
            {isPopulating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Populating...
              </>
            ) : (
              "Populate Calendar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
