"use client"

import { useState, useEffect } from "react"
import { format, isThisWeek } from "date-fns"
import {
  Plus,
  Calendar as CalendarIcon,
  List,
  Clapperboard,
  LayoutDashboard,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ContentCalendar } from "./content-calendar"
import { PostList } from "./post-list"
import { ProductionKanban } from "./production-kanban"
import { PillarBalance } from "./pillar-balance"
import { ContentAnalytics } from "./content-analytics"
import { EngagementChecklist } from "./engagement-checklist"
import { CreatePostDialog } from "./create-post-dialog"
import { NinetyDayTemplate } from "./ninety-day-template"
import type { InstagramPost, EngagementCheck } from "@/lib/services/instagram"

interface InstagramPageClientProps {
  workspaceId: string
  posts: InstagramPost[]
  engagementChecks: EngagementCheck[]
  userName?: string
}

export function InstagramPageClient({
  workspaceId,
  posts,
  engagementChecks,
  userName = "Founder",
}: InstagramPageClientProps) {
  const [viewMode, setViewMode] = useState<"room" | "pipeline" | "calendar" | "list">("room")
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined)
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    setCurrentTime(format(new Date(), "h:mm a"))
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "h:mm a"))
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Handlers
  const handleCreateNew = (date?: string) => {
    setSelectedPost(null)
    setDefaultDate(date)
    setIsDialogOpen(true)
  }

  const handleEditPost = (post: InstagramPost) => {
    setSelectedPost(post)
    setIsDialogOpen(true)
  }

  // Calculate Metrics
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthPosts = posts.filter((p) => {
    if (!p.scheduled_date) return false
    const d = new Date(p.scheduled_date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  const inPipelineCount = posts.filter(
    (p) =>
      p.status === "idea" ||
      p.status === "draft" ||
      p.status === "scripted" ||
      p.status === "shot" ||
      p.status === "editing" ||
      p.status === "ready"
  ).length

  const postsThisWeek = posts.filter((p) => {
    if (!p.scheduled_date) return false
    return isThisWeek(new Date(p.scheduled_date), { weekStartsOn: 1 })
  }).length

  // Health Calculation: Target is 3 posts/week
  const healthStatus =
    postsThisWeek >= 3
      ? { label: "🟢 Excellent", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30" }
      : postsThisWeek >= 1
      ? { label: "🟡 Moderate", color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30" }
      : { label: "🔴 Needs Attention", color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30" }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* ─────────────────────────────────────────────────────────────────────────
          Section 1: Top Command Room Header & Quick Stats Bar
      ───────────────────────────────────────────────────────────────────────── */}
      <div className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs space-y-4">
        {/* Title row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <span>🎬 CONTENT MANAGEMENT ROOM</span>
              <span className="text-muted-foreground font-normal text-sm sm:text-base">
                — {userName} — Founder
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-3">
              <span>📅 {format(now, "MMMM d, yyyy")}</span>
              {currentTime && <span>⏰ {currentTime}</span>}
              <span className="hidden md:inline text-muted-foreground/60">• TCG Personal Branding & Systems Studio</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <NinetyDayTemplate workspaceId={workspaceId} existingPostCount={posts.length} />
            <Button onClick={() => handleCreateNew()} size="sm" className="h-9 gap-1 text-xs">
              <Plus className="h-4 w-4" />
              New Post / Idea
            </Button>
          </div>
        </div>

        {/* Quick Health & Metric Badges */}
        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border/40 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border font-semibold ${healthStatus.color}`}>
              <span>Content Health:</span> {healthStatus.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-muted/60 font-mono text-muted-foreground">
              <span>🔄 Pipeline:</span> <strong className="text-foreground">{inPipelineCount} Posts</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-muted/60 font-mono text-muted-foreground">
              <span>📅 This Month:</span> <strong className="text-foreground">{monthPosts.length} Posts</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-muted/60 font-mono text-muted-foreground">
              <span>🎯 Weekly Target:</span> <strong className="text-foreground">{Math.min(postsThisWeek, 3)}/3</strong>
            </span>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center bg-muted/80 p-1 rounded-lg border border-border/50">
            <Button
              variant={viewMode === "room" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("room")}
              className="h-7 text-xs font-medium gap-1"
            >
              <LayoutDashboard className="h-3 w-3" />
              Command Room
            </Button>
            <Button
              variant={viewMode === "pipeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("pipeline")}
              className="h-7 text-xs font-medium gap-1 text-primary"
            >
              <Clapperboard className="h-3 w-3" />
              Pipeline
            </Button>
            <Button
              variant={viewMode === "calendar" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("calendar")}
              className="h-7 text-xs font-medium gap-1"
            >
              <CalendarIcon className="h-3 w-3" />
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 text-xs font-medium gap-1"
            >
              <List className="h-3 w-3" />
              Table
            </Button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          Section 2: Production Pipeline (6-Stage Kanban)
      ───────────────────────────────────────────────────────────────────────── */}
      {(viewMode === "room" || viewMode === "pipeline") && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
              <span>🔄 PRODUCTION PIPELINE</span>
              <span className="text-xs font-normal text-muted-foreground font-mono">
                (6-Stage Workflow: Ideas ➔ Scripted ➔ Shot ➔ Editing ➔ Ready ➔ Posted)
              </span>
            </h2>
          </div>
          <ProductionKanban
            posts={posts}
            onPostClick={handleEditPost}
            onCreateNew={() => handleCreateNew()}
          />
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          Section 3 & 4: Content Analytics (Left) & Pillar Balance (Right)
      ───────────────────────────────────────────────────────────────────────── */}
      {(viewMode === "room") && (
        <section className="grid gap-6 md:grid-cols-2">
          <ContentAnalytics posts={posts} targetPosts={21} />
          <PillarBalance posts={posts} />
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          Section 5: Content Calendar (Full Width)
      ───────────────────────────────────────────────────────────────────────── */}
      {(viewMode === "room" || viewMode === "calendar") && (
        <section className="rounded-xl border bg-card p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" />
              <span>📅 CONTENT CALENDAR</span>
              <span className="text-xs font-normal text-muted-foreground font-mono">
                (Mon/Wed/Fri Posting Schedule Highlighted)
              </span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary/40" />
                Posting Days
              </span>
            </div>
          </div>

          <ContentCalendar
            posts={posts}
            onPostClick={handleEditPost}
            onDateClick={(date) => handleCreateNew(date)}
          />
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          Section 6 & 7: Post List (Table View) & Daily Engagement Checklist
      ───────────────────────────────────────────────────────────────────────── */}
      {(viewMode === "room" || viewMode === "list") && (
        <section className={`grid gap-6 ${viewMode === "room" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
          <PostList posts={posts} onPostClick={handleEditPost} />
          {viewMode === "room" && (
            <EngagementChecklist workspaceId={workspaceId} initialChecks={engagementChecks} />
          )}
        </section>
      )}

      {/* Create / Edit Dialog with Scripting Studio */}
      <CreatePostDialog
        workspaceId={workspaceId}
        editPost={selectedPost}
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedPost(null)
            setDefaultDate(undefined)
          }
        }}
      />
    </div>
  )
}
