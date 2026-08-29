"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Lightbulb,
  FileEdit,
  Video,
  Scissors,
  Sparkles,
  CheckCircle2,
  Plus,
  ArrowRight,
  Loader2,
  FileText,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PillarBadge } from "./pillar-badge"
import { QuickStatusSelector } from "./quick-status-selector"
import { updatePostStatus } from "@/lib/services/instagram"
import type { InstagramPost, IgPostStatus } from "@/lib/services/instagram"

interface ProductionKanbanProps {
  posts: InstagramPost[]
  onPostClick: (post: InstagramPost) => void
  onCreateNew: () => void
  onOpen90Day?: () => void
}

interface ColumnConfig {
  id: string
  title: string
  icon: React.ElementType
  color: string
  headerBg: string
  statuses: IgPostStatus[]
  nextStatus?: IgPostStatus
  nextActionLabel?: string
}

const COLUMNS: ColumnConfig[] = [
  {
    id: "ideas",
    title: "💡 IDEAS",
    icon: Lightbulb,
    color: "border-slate-200 dark:border-slate-800 bg-slate-500/5",
    headerBg: "text-slate-700 dark:text-slate-300",
    statuses: ["idea", "draft"],
    nextStatus: "scripted",
    nextActionLabel: "Scripted ✍️",
  },
  {
    id: "scripted",
    title: "✍️ SCRIPTED",
    icon: FileEdit,
    color: "border-indigo-200 dark:border-indigo-900/60 bg-indigo-500/5",
    headerBg: "text-indigo-700 dark:text-indigo-300",
    statuses: ["scripted"],
    nextStatus: "shot",
    nextActionLabel: "Mark Shot 🎥",
  },
  {
    id: "shot",
    title: "🎥 SHOT",
    icon: Video,
    color: "border-orange-200 dark:border-orange-900/60 bg-orange-500/5",
    headerBg: "text-orange-700 dark:text-orange-300",
    statuses: ["shot"],
    nextStatus: "editing",
    nextActionLabel: "Editing ✂️",
  },
  {
    id: "editing",
    title: "✂️ EDITING",
    icon: Scissors,
    color: "border-cyan-200 dark:border-cyan-900/60 bg-cyan-500/5",
    headerBg: "text-cyan-700 dark:text-cyan-300",
    statuses: ["editing"],
    nextStatus: "ready",
    nextActionLabel: "Mark Ready ✨",
  },
  {
    id: "ready",
    title: "✨ READY",
    icon: Sparkles,
    color: "border-emerald-200 dark:border-emerald-900/60 bg-emerald-500/5",
    headerBg: "text-emerald-700 dark:text-emerald-300",
    statuses: ["ready"],
    nextStatus: "published",
    nextActionLabel: "Mark Posted 🚀",
  },
  {
    id: "posted",
    title: "🚀 POSTED",
    icon: CheckCircle2,
    color: "border-pink-200 dark:border-pink-900/60 bg-pink-500/5",
    headerBg: "text-pink-700 dark:text-pink-300",
    statuses: ["published", "scheduled"],
  },
]

export function ProductionKanban({
  posts,
  onPostClick,
  onCreateNew,
  onOpen90Day,
}: ProductionKanbanProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()

  const handleAdvanceStatus = async (
    e: React.MouseEvent,
    postId: string,
    targetStatus: IgPostStatus
  ) => {
    e.stopPropagation()
    setUpdatingId(postId)
    try {
      await updatePostStatus(postId, targetStatus)
      toast.success(`Post moved to ${targetStatus.replace("_", " ")}`)
      router.refresh()
    } catch (error) {
      console.error("Failed to update status", error)
      toast.error("Failed to advance status")
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* 6-Column Responsive Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {COLUMNS.map((col) => {
          const colPosts = posts.filter((p) => col.statuses.includes(p.status))
          const ColIcon = col.icon

          return (
            <div
              key={col.id}
              className={`rounded-lg border p-2.5 min-h-[360px] flex flex-col transition-colors ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-border/40 mb-2.5">
                <div className={`flex items-center gap-1.5 font-bold text-xs ${col.headerBg}`}>
                  <ColIcon className="h-3.5 w-3.5" />
                  <span>{col.title}</span>
                </div>
                <span className="text-[11px] font-mono bg-background border border-border/60 px-1.5 py-0.2 rounded-full text-muted-foreground font-semibold">
                  {colPosts.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-0.5">
                {colPosts.length === 0 ? (
                  <div className="h-28 border border-dashed rounded-md flex flex-col items-center justify-center text-[11px] text-muted-foreground text-center p-2">
                    <span>Empty Stage</span>
                  </div>
                ) : (
                  colPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onPostClick(post)}
                      className="bg-card border rounded-md p-2.5 shadow-2xs hover:border-primary/60 transition-all cursor-pointer space-y-1.5 group"
                    >
                      {/* Post Title */}
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          📌 {post.title}
                        </h5>
                      </div>

                      {/* Script or Hook Snippet */}
                      {post.full_script ? (
                        <p className="text-[10px] text-muted-foreground line-clamp-2 italic bg-muted/40 p-1 rounded font-mono">
                          &quot;{post.full_script}&quot;
                        </p>
                      ) : post.hook_text ? (
                        <p className="text-[10px] text-muted-foreground line-clamp-2">
                          Hook: {post.hook_text}
                        </p>
                      ) : null}

                      {/* Badges & Quick Status */}
                      <div
                        className="pt-1 flex flex-wrap items-center justify-between gap-1 border-t border-border/40"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PillarBadge pillar={post.pillar} />
                        <QuickStatusSelector postId={post.id} currentStatus={post.status} />
                      </div>

                      {/* 1-Click Advance Button */}
                      {col.nextStatus && col.nextActionLabel && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={updatingId === post.id}
                          onClick={(e) => handleAdvanceStatus(e, post.id, col.nextStatus!)}
                          className="w-full h-6 text-[10px] font-medium gap-1 mt-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {updatingId === post.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <span>{col.nextActionLabel}</span>
                              <ArrowRight className="h-2.5 w-2.5" />
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pipeline Action Bar */}
      <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onCreateNew} className="h-8 text-xs font-medium">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Idea
          </Button>
          {onOpen90Day && (
            <Button size="sm" variant="outline" onClick={onOpen90Day} className="h-8 text-xs font-medium">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-primary" />
              ⚡ 90-Day Plan
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground hidden sm:block">
          💡 Click any card to edit script dialogue & teleprompter lines
        </p>
      </div>
    </div>
  )
}
