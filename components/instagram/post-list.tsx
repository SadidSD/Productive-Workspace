"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Film,
  Images,
  CircleDot,
  Radio,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Search,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { PillarBadge } from "./pillar-badge"
import { FormulaBadge } from "./formula-badge"
import { QuickStatusSelector } from "./quick-status-selector"
import { deleteInstagramPost } from "@/lib/services/instagram"

import type {
  InstagramPost,
  IgPostFormat,
} from "@/lib/services/instagram"

interface PostListProps {
  posts: InstagramPost[]
  onPostClick: (post: InstagramPost) => void
}

const FormatIcon = ({ format }: { format: IgPostFormat }) => {
  switch (format) {
    case "reel":
      return <Film className="h-3.5 w-3.5 text-rose-500" />
    case "carousel":
      return <Images className="h-3.5 w-3.5 text-blue-500" />
    case "story":
      return <CircleDot className="h-3.5 w-3.5 text-amber-500" />
    case "live":
      return <Radio className="h-3.5 w-3.5 text-purple-500" />
    default:
      return <Film className="h-3.5 w-3.5 text-muted-foreground" />
  }
}

export function PostList({ posts, onPostClick }: PostListProps) {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [pillarFilter, setPillarFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [formatFilter, setFormatFilter] = useState<string>("all")

  const handleDelete = async (postId: string) => {
    try {
      await deleteInstagramPost(postId)
      toast.success("Post deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Failed to delete post")
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.caption?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    const matchesPillar = pillarFilter === "all" || post.pillar === pillarFilter
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    const matchesFormat = formatFilter === "all" || post.format === formatFilter

    return matchesSearch && matchesPillar && matchesStatus && matchesFormat
  })

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-base font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            📋 Post List (Table View)
          </span>
          <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {filteredPosts.length} of {posts.length} Posts
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 pt-3 flex-1 flex flex-col">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search posts or captions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[115px] h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="idea">Idea 💡</SelectItem>
                <SelectItem value="scripted">Scripted ✍️</SelectItem>
                <SelectItem value="shot">Shot 🎥</SelectItem>
                <SelectItem value="editing">Editing ✂️</SelectItem>
                <SelectItem value="ready">Ready ✨</SelectItem>
                <SelectItem value="published">Posted 🚀</SelectItem>
              </SelectContent>
            </Select>

            <Select value={pillarFilter} onValueChange={setPillarFilter}>
              <SelectTrigger className="w-[115px] h-8 text-xs">
                <SelectValue placeholder="Pillar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Pillars</SelectItem>
                <SelectItem value="platform_pain">Platform Pain</SelectItem>
                <SelectItem value="solution">Solution</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="comparison">Comparison</SelectItem>
                <SelectItem value="case_study">Case Study</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-md border overflow-x-auto flex-1">
          <Table>
            <TableHeader>
              <TableRow className="text-xs">
                <TableHead className="py-2">Title / Hook</TableHead>
                <TableHead className="py-2">Status</TableHead>
                <TableHead className="py-2">Pillar</TableHead>
                <TableHead className="py-2">Format</TableHead>
                <TableHead className="py-2">VVA</TableHead>
                <TableHead className="py-2 w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-28 text-muted-foreground text-xs">
                    No posts found matching filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => {
                  const vvaCount = [post.has_value, post.has_vulnerability, post.has_authority].filter(Boolean).length
                  const vvaString = "✅".repeat(vvaCount) || "—"

                  return (
                    <TableRow
                      key={post.id}
                      className="hover:bg-muted/50 cursor-pointer text-xs group"
                      onClick={() => onPostClick(post)}
                    >
                      <TableCell className="font-medium max-w-[180px]">
                        <div className="flex items-center gap-1.5">
                          {post.full_script && (
                            <span title="Script Written">
                              <FileText className="h-3 w-3 text-indigo-500 shrink-0" />
                            </span>
                          )}
                          <span className="truncate group-hover:text-primary transition-colors">
                            {post.title}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <QuickStatusSelector postId={post.id} currentStatus={post.status} />
                      </TableCell>

                      <TableCell>
                        <PillarBadge pillar={post.pillar} />
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1 capitalize text-[11px] text-muted-foreground">
                          <FormatIcon format={post.format} />
                          <span>{post.format}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`font-mono text-xs ${
                            vvaCount >= 2 ? "text-emerald-600" : "text-amber-500"
                          }`}
                          title={`${vvaCount}/3 VVA Rule`}
                        >
                          {vvaString}
                        </span>
                      </TableCell>

                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-28 text-xs">
                            <DropdownMenuItem onClick={() => onPostClick(post)}>
                              <Edit className="mr-2 h-3.5 w-3.5" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleDelete(post.id)}
                            >
                              <Trash2 className="mr-2 h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
