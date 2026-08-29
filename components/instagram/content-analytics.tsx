"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Film, Images, CircleDot, TrendingUp, Target, Calendar } from "lucide-react"
import type { InstagramPost } from "@/lib/services/instagram"

interface ContentAnalyticsProps {
  posts: InstagramPost[]
  targetPosts?: number
}

export function ContentAnalytics({ posts, targetPosts = 21 }: ContentAnalyticsProps) {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Filter posts for current month
  const monthPosts = posts.filter((p) => {
    if (!p.scheduled_date) return false
    const d = new Date(p.scheduled_date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  // Calculate posts by week of month
  const weekCounts = [0, 0, 0, 0]
  monthPosts.forEach((p) => {
    if (p.scheduled_date) {
      const day = new Date(p.scheduled_date).getDate()
      if (day <= 7) weekCounts[0]++
      else if (day <= 14) weekCounts[1]++
      else if (day <= 21) weekCounts[2]++
      else weekCounts[3]++
    }
  })

  const maxWeekCount = Math.max(...weekCounts, 6)
  const totalMonthCount = monthPosts.length
  const targetCompletion = Math.min(Math.round((totalMonthCount / targetPosts) * 100), 100)

  // Format counts
  const reelCount = posts.filter((p) => p.format === "reel").length
  const carouselCount = posts.filter((p) => p.format === "carousel").length
  const storyCount = posts.filter((p) => p.format === "story").length

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            📊 Content Analytics
          </span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {now.toLocaleString("default", { month: "short" })} {currentYear}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {/* Posts by Week */}
        <div className="space-y-3 bg-muted/30 p-3 rounded-lg border border-border/40">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>📈 Posts by Week</span>
            <span>Target: 3-5/wk</span>
          </div>

          <div className="space-y-2.5">
            {weekCounts.map((count, idx) => {
              const pct = (count / maxWeekCount) * 100
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-mono">Week {idx + 1}</span>
                    <span className="font-medium font-mono">{count} {count === 1 ? "Post" : "Posts"}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/80">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly Target Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span>This Month: <strong className="text-foreground">{totalMonthCount} Posts</strong></span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span>Target: {targetPosts} ({targetCompletion}%)</span>
            </div>
          </div>
          <Progress value={targetCompletion} className="h-2.5" />
        </div>

        {/* Format Distribution Footer */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/40 text-center">
          <div className="bg-muted/40 p-2 rounded-md">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Film className="h-3 w-3 text-rose-500" />
              <span>Reels</span>
            </div>
            <p className="text-sm font-bold font-mono mt-0.5">{reelCount}</p>
          </div>
          <div className="bg-muted/40 p-2 rounded-md">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Images className="h-3 w-3 text-blue-500" />
              <span>Carousels</span>
            </div>
            <p className="text-sm font-bold font-mono mt-0.5">{carouselCount}</p>
          </div>
          <div className="bg-muted/40 p-2 rounded-md">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <CircleDot className="h-3 w-3 text-amber-500" />
              <span>Stories</span>
            </div>
            <p className="text-sm font-bold font-mono mt-0.5">{storyCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
