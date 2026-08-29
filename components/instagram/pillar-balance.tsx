"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Tag, CheckCircle2 } from "lucide-react"
import type { InstagramPost, IgContentPillar } from "@/lib/services/instagram"

interface PillarBalanceProps {
  posts: InstagramPost[]
}

const PILLARS: { id: IgContentPillar; label: string; colorClass: string; barBg: string }[] = [
  { id: "platform_pain", label: "Platform Pain", colorClass: "text-rose-600 dark:text-rose-400", barBg: "bg-rose-500" },
  { id: "solution", label: "Solution", colorClass: "text-blue-600 dark:text-blue-400", barBg: "bg-blue-500" },
  { id: "education", label: "Education", colorClass: "text-amber-600 dark:text-amber-400", barBg: "bg-amber-500" },
  { id: "comparison", label: "Comparison", colorClass: "text-purple-600 dark:text-purple-400", barBg: "bg-purple-500" },
  { id: "case_study", label: "Case Study", colorClass: "text-emerald-600 dark:text-emerald-400", barBg: "bg-emerald-500" },
]

export function PillarBalance({ posts }: PillarBalanceProps) {
  const totalPosts = posts.length

  const counts: Record<IgContentPillar, number> = {
    platform_pain: 0,
    solution: 0,
    education: 0,
    comparison: 0,
    case_study: 0,
  }

  posts.forEach((post) => {
    if (post.pillar) {
      counts[post.pillar] = (counts[post.pillar] || 0) + 1
    }
  })

  // Find pillars with 0 posts
  const zeroPillars = PILLARS.filter((p) => counts[p.id] === 0)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            🏷️ Pillar Balance
          </span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {totalPosts} Total Posts
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 flex-1 flex flex-col justify-between">
        {/* Pillar List */}
        <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/40">
          {PILLARS.map((pillar) => {
            const count = counts[pillar.id]
            const pct = totalPosts > 0 ? Math.round((count / totalPosts) * 100) : 0

            return (
              <div key={pillar.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${pillar.colorClass}`}>{pillar.label}</span>
                  <span className="font-mono text-muted-foreground text-[11px]">
                    <strong className="text-foreground">{pct}%</strong> ({count} {count === 1 ? "post" : "posts"})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/80">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${pillar.barBg}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Warning Indicator or Healthy Callout */}
        {zeroPillars.length > 0 ? (
          <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div className="leading-tight">
              <span className="font-semibold">⚠️ Balance Warning:</span>{" "}
              <span>
                &quot;{zeroPillars.map((p) => p.label).join(", ")}&quot; {zeroPillars.length > 1 ? "pillars have" : "pillar has"} 0 posts. Schedule content to maintain variety.
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">All 5 content pillars are represented!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
