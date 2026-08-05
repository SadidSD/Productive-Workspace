'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { ScriptEditor } from './script-editor'
import { createInstagramPost, updateInstagramPost } from '@/lib/services/instagram'
import type {
  InstagramPost,
  IgPostFormat,
  IgPostStatus,
  IgContentPillar,
  IgScriptFormula,
  IgFunnelStage,
} from '@/lib/services/instagram'

interface CreatePostDialogProps {
  workspaceId: string
  editPost?: InstagramPost | null
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreatePostDialog({
  workspaceId,
  editPost,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreatePostDialogProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    controlledOnOpenChange?.(newOpen)
  }

  // Form State
  const [title, setTitle] = React.useState('')
  const [caption, setCaption] = React.useState('')
  const [format, setFormat] = React.useState<IgPostFormat>('reel')
  const [status, setStatus] = React.useState<IgPostStatus>('idea')
  const [pillar, setPillar] = React.useState<IgContentPillar | ''>('')
  const [scriptFormula, setScriptFormula] = React.useState<IgScriptFormula | ''>('')
  const [funnelStage, setFunnelStage] = React.useState<IgFunnelStage | ''>('')

  // Script Structure
  const [hookText, setHookText] = React.useState('')
  const [retainText, setRetainText] = React.useState('')
  const [rewardText, setRewardText] = React.useState('')

  // Extended Scripting Studio
  const [fullScript, setFullScript] = React.useState('')
  const [brollNotes, setBrollNotes] = React.useState('')
  const [textOverlays, setTextOverlays] = React.useState('')
  const [audioCues, setAudioCues] = React.useState('')

  // VVA Framework
  const [hasValue, setHasValue] = React.useState(false)
  const [hasVulnerability, setHasVulnerability] = React.useState(false)
  const [hasAuthority, setHasAuthority] = React.useState(false)

  // Scheduling & Metadata
  const [scheduledDate, setScheduledDate] = React.useState('')
  const [scheduledTime, setScheduledTime] = React.useState('')
  const [cta, setCta] = React.useState('DM me "TCG" to see how I can help.')
  const [hashtags, setHashtags] = React.useState('')
  const [mediaNotes, setMediaNotes] = React.useState('')
  const [notes, setNotes] = React.useState('')

  React.useEffect(() => {
    if (open) {
      if (editPost) {
        setTitle(editPost.title || '')
        setCaption(editPost.caption || '')
        setFormat(editPost.format || 'reel')
        setStatus(editPost.status || 'idea')
        setPillar(editPost.pillar || '')
        setScriptFormula(editPost.script_formula || '')
        setFunnelStage(editPost.funnel_stage || '')
        setHookText(editPost.hook_text || '')
        setRetainText(editPost.retain_text || '')
        setRewardText(editPost.reward_text || '')
        setFullScript(editPost.full_script || '')
        setBrollNotes(editPost.broll_notes || '')
        setTextOverlays(editPost.text_overlays || '')
        setAudioCues(editPost.audio_cues || '')
        setHasValue(editPost.has_value || false)
        setHasVulnerability(editPost.has_vulnerability || false)
        setHasAuthority(editPost.has_authority || false)
        setScheduledDate(editPost.scheduled_date || '')
        setScheduledTime(editPost.scheduled_time || '')
        setCta(editPost.cta || 'DM me "TCG" to see how I can help.')
        setHashtags(editPost.hashtags?.join(', ') || '')
        setMediaNotes(editPost.media_notes || '')
        setNotes(editPost.notes || '')
      } else {
        // Reset form for new post
        setTitle('')
        setCaption('')
        setFormat('reel')
        setStatus('idea')
        setPillar('')
        setScriptFormula('')
        setFunnelStage('')
        setHookText('')
        setRetainText('')
        setRewardText('')
        setFullScript('')
        setBrollNotes('')
        setTextOverlays('')
        setAudioCues('')
        setHasValue(false)
        setHasVulnerability(false)
        setHasAuthority(false)
        setScheduledDate('')
        setScheduledTime('')
        setCta('DM me "TCG" to see how I can help.')
        setHashtags('')
        setMediaNotes('')
        setNotes('')
      }
    }
  }, [open, editPost])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Title / Hook is required')
      return
    }

    setIsLoading(true)
    try {
      const data = {
        title,
        caption,
        format,
        status,
        pillar: pillar || null,
        script_formula: scriptFormula || null,
        funnel_stage: funnelStage || null,
        hook_text: hookText,
        retain_text: retainText,
        reward_text: rewardText,
        full_script: fullScript,
        broll_notes: brollNotes,
        text_overlays: textOverlays,
        audio_cues: audioCues,
        has_value: hasValue,
        has_vulnerability: hasVulnerability,
        has_authority: hasAuthority,
        scheduled_date: scheduledDate || null,
        scheduled_time: scheduledTime || null,
        cta,
        hashtags: hashtags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        media_notes: mediaNotes,
        notes,
      }

      if (editPost) {
        await updateInstagramPost(editPost.id, data)
        toast.success('Post updated successfully')
      } else {
        await createInstagramPost(workspaceId, data)
        toast.success('Post created successfully')
      }

      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to save post:', error)
      toast.error(editPost ? 'Failed to update post' : 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editPost ? 'Edit Post & Script' : 'Create New Post & Script'}</DialogTitle>
          <DialogDescription>
            {editPost
              ? 'Update script dialogue, B-roll notes, and post status.'
              : 'Draft a new Reel idea, write full scripts, and plan your production pipeline.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Section 1: Core Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium leading-none">Core Info</h3>
            <div className="grid gap-2">
              <Label htmlFor="title">Title / Hook Idea *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., TCGplayer fees are stealing your profit..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="format">Format</Label>
                <Select value={format} onValueChange={(v: IgPostFormat) => setFormat(v)}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reel">Reel</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Production Status</Label>
                <Select value={status} onValueChange={(v: IgPostStatus) => setStatus(v)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea 💡</SelectItem>
                    <SelectItem value="draft">Draft 📝</SelectItem>
                    <SelectItem value="scripted">Scripted ✍️</SelectItem>
                    <SelectItem value="shot">Shot / Filmed 🎥</SelectItem>
                    <SelectItem value="editing">Editing ✂️</SelectItem>
                    <SelectItem value="ready">Ready ✨</SelectItem>
                    <SelectItem value="scheduled">Scheduled 📅</SelectItem>
                    <SelectItem value="published">Posted 🚀</SelectItem>
                    <SelectItem value="missed">Missed ⚠️</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 2: Scripting Studio Workspace */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium leading-none flex items-center justify-between">
              <span>Scripting Studio</span>
              <span className="text-xs text-muted-foreground font-normal">
                Draft full dialogue, B-Roll, & captions
              </span>
            </h3>
            <ScriptEditor
              hookText={hookText}
              setHookText={setHookText}
              retainText={retainText}
              setRetainText={setRetainText}
              rewardText={rewardText}
              setRewardText={setRewardText}
              fullScript={fullScript}
              setFullScript={setFullScript}
              brollNotes={brollNotes}
              setBrollNotes={setBrollNotes}
              textOverlays={textOverlays}
              setTextOverlays={setTextOverlays}
              audioCues={audioCues}
              setAudioCues={setAudioCues}
            />
          </div>

          <Separator />

          {/* Section 3: Strategy Framework */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium leading-none">Strategy Framework</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pillar">Content Pillar</Label>
                <Select value={pillar} onValueChange={(v: IgContentPillar) => setPillar(v)}>
                  <SelectTrigger id="pillar">
                    <SelectValue placeholder="Select pillar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform_pain">Platform Pain</SelectItem>
                    <SelectItem value="solution">Solution</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="comparison">Comparison</SelectItem>
                    <SelectItem value="case_study">Case Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scriptFormula">Script Formula</Label>
                <Select value={scriptFormula} onValueChange={(v: IgScriptFormula) => setScriptFormula(v)}>
                  <SelectTrigger id="scriptFormula">
                    <SelectValue placeholder="Select formula" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="problem_agitate_solve">Problem-Agitate-Solve</SelectItem>
                    <SelectItem value="before_after_bridge">Before-After-Bridge</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="opinion_reasoning">Opinion+Reasoning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="funnelStage">Funnel Stage</Label>
                <Select value={funnelStage} onValueChange={(v: IgFunnelStage) => setFunnelStage(v)}>
                  <SelectTrigger id="funnelStage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Awareness</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="trust">Trust</SelectItem>
                    <SelectItem value="conversion">Conversion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 4: VVA Framework */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium leading-none">VVA Framework</h3>
              <span className="text-xs text-muted-foreground">Aim for at least 2 of 3</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasValue"
                  checked={hasValue}
                  onCheckedChange={(checked) => setHasValue(!!checked)}
                />
                <Label htmlFor="hasValue" className="text-xs cursor-pointer">
                  Value (Educate/Solve)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasVulnerability"
                  checked={hasVulnerability}
                  onCheckedChange={(checked) => setHasVulnerability(!!checked)}
                />
                <Label htmlFor="hasVulnerability" className="text-xs cursor-pointer">
                  Vulnerability (Real Story)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasAuthority"
                  checked={hasAuthority}
                  onCheckedChange={(checked) => setHasAuthority(!!checked)}
                />
                <Label htmlFor="hasAuthority" className="text-xs cursor-pointer">
                  Authority (Proof/Results)
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Section 5: Caption & Metadata */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium leading-none">Caption & Scheduling</h3>
            <div className="grid gap-2">
              <Label htmlFor="caption">Instagram Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Full Instagram post caption text..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cta">Call to Action (CTA)</Label>
              <Input
                id="cta"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder='DM me "TCG" to see how I can help.'
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hashtags">Hashtags (comma separated)</Label>
              <Input
                id="hashtags"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#tcgstore, #pokemontcg, #webdeveloper"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? editPost
                  ? 'Saving...'
                  : 'Creating...'
                : editPost
                ? 'Save Changes'
                : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
