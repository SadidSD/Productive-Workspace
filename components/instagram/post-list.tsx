'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Film, Images, CircleDot, Radio, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

import { PillarBadge } from './pillar-badge'
import { FormulaBadge } from './formula-badge'
import { StatusBadge } from './status-badge'
import { QuickStatusSelector } from './quick-status-selector'
import { deleteInstagramPost } from '@/lib/services/instagram'

import type {
  InstagramPost,
  IgPostFormat,
  IgPostStatus,
  IgContentPillar,
  IgScriptFormula,
  IgFunnelStage,
} from '@/lib/services/instagram'

interface PostListProps {
  posts: InstagramPost[]
  onPostClick: (post: InstagramPost) => void
}

const FormatIcon = ({ format }: { format: IgPostFormat }) => {
  switch (format) {
    case 'reel': return <Film className="h-4 w-4 text-muted-foreground" />
    case 'carousel': return <Images className="h-4 w-4 text-muted-foreground" />
    case 'story': return <CircleDot className="h-4 w-4 text-muted-foreground" />
    case 'live': return <Radio className="h-4 w-4 text-muted-foreground" />
    default: return <Film className="h-4 w-4 text-muted-foreground" />
  }
}

export function PostList({ posts, onPostClick }: PostListProps) {
  const router = useRouter()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [pillarFilter, setPillarFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [formatFilter, setFormatFilter] = useState<string>('all')
  const [funnelFilter, setFunnelFilter] = useState<string>('all')

  const handleDelete = async (postId: string) => {
    try {
      await deleteInstagramPost(postId)
      toast.success('Post deleted successfully')
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (post.caption?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesPillar = pillarFilter === 'all' || post.pillar === pillarFilter
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesFormat = formatFilter === 'all' || post.format === formatFilter
    const matchesFunnel = funnelFilter === 'all' || post.funnel_stage === funnelFilter

    return matchesSearch && matchesPillar && matchesStatus && matchesFormat && matchesFunnel
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        
        <div className="flex flex-wrap gap-2">
          <Select value={pillarFilter} onValueChange={setPillarFilter}>
            <SelectTrigger className="w-[140px]">
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="idea">Idea 💡</SelectItem>
              <SelectItem value="draft">Draft 📝</SelectItem>
              <SelectItem value="scripted">Scripted ✍️</SelectItem>
              <SelectItem value="shot">Shot 🎥</SelectItem>
              <SelectItem value="editing">Editing ✂️</SelectItem>
              <SelectItem value="ready">Ready ✨</SelectItem>
              <SelectItem value="scheduled">Scheduled 📅</SelectItem>
              <SelectItem value="published">Posted 🚀</SelectItem>
              <SelectItem value="missed">Missed ⚠️</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Formats</SelectItem>
              <SelectItem value="reel">Reel</SelectItem>
              <SelectItem value="carousel">Carousel</SelectItem>
              <SelectItem value="story">Story</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>

          <Select value={funnelFilter} onValueChange={setFunnelFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Funnel Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="awareness">Awareness</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="trust">Trust</SelectItem>
              <SelectItem value="conversion">Conversion</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title / Hook</TableHead>
              <TableHead>Pillar</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Formula</TableHead>
              <TableHead>Funnel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>VVA</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => onPostClick(post)}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.pillar && <PillarBadge pillar={post.pillar} />}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 capitalize text-sm">
                      <FormatIcon format={post.format} />
                      {post.format}
                    </div>
                  </TableCell>
                  <TableCell>{post.script_formula && <FormulaBadge formula={post.script_formula} />}</TableCell>
                  <TableCell className="capitalize text-sm">{post.funnel_stage}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <QuickStatusSelector postId={post.id} currentStatus={post.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.scheduled_date ? format(new Date(post.scheduled_date), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${post.has_value ? 'bg-green-500' : 'bg-gray-300'}`} title="Value" />
                      <div className={`w-2 h-2 rounded-full ${post.has_vulnerability ? 'bg-green-500' : 'bg-gray-300'}`} title="Vulnerability" />
                      <div className={`w-2 h-2 rounded-full ${post.has_authority ? 'bg-green-500' : 'bg-gray-300'}`} title="Authority" />
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onPostClick(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(post.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
