"use client"

import { useState } from "react"
import { Plus, Calendar, List, Layers, Inbox, CheckCircle2, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ContentCalendar } from "./content-calendar"
import { PostList } from "./post-list"
import { PillarBalance } from "./pillar-balance"
import { EngagementChecklist } from "./engagement-checklist"
import { CreatePostDialog } from "./create-post-dialog"
import { NinetyDayTemplate } from "./ninety-day-template"
import type { InstagramPost, EngagementCheck } from "@/lib/services/instagram"

interface InstagramPageClientProps {
  workspaceId: string
  posts: InstagramPost[]
  engagementChecks: EngagementCheck[]
}

export function InstagramPageClient({
  workspaceId,
  posts,
  engagementChecks,
}: InstagramPageClientProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<string | undefined>(undefined)

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
    (p) => p.status === "idea" || p.status === "draft" || p.status === "ready"
  ).length

  const publishedCount = posts.filter((p) => p.status === "published").length

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Instagram Content Planner</h2>
          <p className="text-muted-foreground mt-1">
            Systemized content strategy for TCG personal branding & agency sales.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <NinetyDayTemplate workspaceId={workspaceId} existingPostCount={posts.length} />
          <Button onClick={() => handleCreateNew()}>
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Posts This Month"
          value={monthPosts.length}
          icon={Layers}
          description="Scheduled & published"
        />
        <MetricCard
          title="In Pipeline"
          value={inPipelineCount}
          icon={Inbox}
          description="Ideas, drafts & ready"
        />
        <MetricCard
          title="Published"
          value={publishedCount}
          icon={CheckCircle2}
          description="Total published posts"
        />
        <MetricCard
          title="Content Funnel"
          value="Awareness"
          icon={Target}
          description="Mon 1: Pain Points focus"
        />
      </div>

      {/* Main Grid split */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Calendar/List View (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight text-foreground/90">
              Content Schedule
            </h3>
            <div className="flex items-center bg-muted p-1 rounded-lg border border-border/50">
              <Button
                variant={viewMode === "calendar" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("calendar")}
                className="h-8 text-xs font-medium"
              >
                <Calendar className="mr-1.5 h-3.5 w-3.5" />
                Calendar View
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 text-xs font-medium"
              >
                <List className="mr-1.5 h-3.5 w-3.5" />
                Table View
              </Button>
            </div>
          </div>

          {viewMode === "calendar" ? (
            <ContentCalendar
              posts={posts}
              onPostClick={handleEditPost}
              onDateClick={(date) => handleCreateNew(date)}
            />
          ) : (
            <PostList posts={posts} onPostClick={handleEditPost} />
          )}
        </div>

        {/* Right Column: Pillar Balance + Daily Engagement Checklist (1/3 width) */}
        <div className="space-y-6">
          <EngagementChecklist workspaceId={workspaceId} initialChecks={engagementChecks} />
          <PillarBalance posts={posts} />
        </div>
      </div>

      {/* Create / Edit Dialog */}
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
