"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Lightbulb,
  FileEdit,
  Video,
  Scissors,
  CheckCircle2,
  Plus,
  ArrowRight,
  Loader2,
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
}

interface ColumnConfig {
  id: string
  title: string
  icon: React.ElementType
  color: string
  statuses: IgPostStatus[]
  nextStatus?: IgPostStatus
  nextActionLabel?: string
}

const COLUMNS: ColumnConfig[] = [
  {
    id: "ideas",
    title: "1. Ideas 💡",
    icon: Lightbulb,
    color: "border-slate-300 dark:border-slate-800 bg-slate-500/5",
    statuses: ["idea", "draft"],
    nextStatus: "scripted",
    nextActionLabel: "Scripted ✍️",
  },
  {
    id: "scripted",
    title: "2. Scripted ✍️",
    icon: FileEdit,
    color: "border-indigo-300 dark:border-indigo-900 bg-indigo-500/5",
    statuses: ["scripted"],
    nextStatus: "shot",
    nextActionLabel: "Mark Shot 🎥",
  },
  {
    id: "shot",
    title: "3. Shot 🎥",
    icon: Video,
    color: "border-orange-300 dark:border-orange-900 bg-orange-500/5",
    statuses: ["shot"],
    nextStatus: "editing",
    nextActionLabel: "Editing ✂️",
  },
  {
    id: "editing",
    title: "4. Editing ✂️",
    icon: Scissors,
    color: "border-cyan-300 dark:border-cyan-900 bg-cyan-500/5",
    statuses: ["editing", "ready"],
    nextStatus: "published",
    nextActionLabel: "Mark Posted 🚀",
  },
  {
    id: "posted",
    title: "5. Posted 🚀",
    icon: CheckCircle2,
    color: "border-pink-300 dark:border-pink-900 bg-pink-500/5",
    statuses: ["published", "scheduled"],
  },
]

export function ProductionKanban({
  posts,
  onPostClick,
  onCreateNew,
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
    <div className="space-y-4">
      {/* Pipeline Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Production Pipeline — Track from Idea ➔ Script ➔ Filming ➔ Editing ➔ Posted
          </h4>
        </div>
        <Button size="sm" variant="outline" onClick={onCreateNew} className="h-8 text-xs">
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Idea
        </Button>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colPosts = posts.filter((p) => col.statuses.includes(p.status))
          const ColIcon = col.icon

          return (
            <div
              key={col.id}
              className={`rounded-lg border p-3 min-h-[420px] flex flex-col ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b mb-3">
                <div className="flex items-center gap-1.5">
                  <ColIcon className="h-4 w-4 text-foreground/80" />
                  <span className="text-xs font-semibold">{col.title}</span>
                </div>
                <span className="text-xs font-mono bg-background border px-1.5 py-0.5 rounded-full text-muted-foreground">
                  {colPosts.length}
                </span>
              </div>

              {/* Column Content */}
              <div className="space-y-2.5 flex-1">
                {colPosts.length === 0 ? (
                  <div className="h-32 border border-dashed rounded-md flex items-center justify-center text-[11px] text-muted-foreground text-center p-2">
                    No posts in stage
                  </div>
                ) : (
                  colPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => onPostClick(post)}
                      className="bg-card border rounded-md p-3 shadow-xs hover:border-primary/50 transition-all cursor-pointer space-y-2 group"
                    >
                      {/* Post Header */}
                      <div className="flex items-start justify-between gap-1">
                        <h5 className="text-xs font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {post.title}
                        </h5>
                      </div>

                      {/* Snippet / Script indicator */}
                      {post.full_script ? (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 italic bg-muted/30 p-1.5 rounded font-mono">
                          &quot;{post.full_script}&quot;
                        </p>
                      ) : post.hook_text ? (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">
                          Hook: {post.hook_text}
                        </p>
                      ) : null}

                      {/* Badges & Actions */}
                      <div className="pt-1 flex flex-wrap items-center justify-between gap-1 border-t border-border/40">
                        <PillarBadge pillar={post.pillar} />
                        <QuickStatusSelector postId={post.id} currentStatus={post.status} />
                      </div>

                      {/* Quick Advance Button */}
                      {col.nextStatus && col.nextActionLabel && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={updatingId === post.id}
                          onClick={(e) => handleAdvanceStatus(e, post.id, col.nextStatus!)}
                          className="w-full h-7 text-[11px] font-medium gap-1 mt-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          {updatingId === post.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <span>{col.nextActionLabel}</span>
                              <ArrowRight className="h-3 w-3" />
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
    </div>
  )
}
