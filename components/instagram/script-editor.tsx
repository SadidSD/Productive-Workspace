"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Video, Type, Music, Sparkles } from "lucide-react"

interface ScriptEditorProps {
  hookText: string
  setHookText: (val: string) => void
  retainText: string
  setRetainText: (val: string) => void
  rewardText: string
  setRewardText: (val: string) => void
  fullScript: string
  setFullScript: (val: string) => void
  brollNotes: string
  setBrollNotes: (val: string) => void
  textOverlays: string
  setTextOverlays: (val: string) => void
  audioCues: string
  setAudioCues: (val: string) => void
}

export function ScriptEditor({
  hookText,
  setHookText,
  retainText,
  setRetainText,
  rewardText,
  setRewardText,
  fullScript,
  setFullScript,
  brollNotes,
  setBrollNotes,
  textOverlays,
  setTextOverlays,
  audioCues,
  setAudioCues,
}: ScriptEditorProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="script" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted/60 p-1">
          <TabsTrigger value="script" className="text-xs gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Dialogue Script
          </TabsTrigger>
          <TabsTrigger value="structure" className="text-xs gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Hook & Story
          </TabsTrigger>
          <TabsTrigger value="broll" className="text-xs gap-1.5">
            <Video className="h-3.5 w-3.5" />
            B-Roll / Shot List
          </TabsTrigger>
          <TabsTrigger value="overlays" className="text-xs gap-1.5">
            <Type className="h-3.5 w-3.5" />
            Text & Audio
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Full Spoken Dialogue Script */}
        <TabsContent value="script" className="space-y-3 pt-3">
          <div className="space-y-1.5">
            <Label htmlFor="fullScript" className="text-xs font-semibold flex items-center justify-between">
              <span>Full Spoken Script / Teleprompter Lines</span>
              <span className="text-[10px] text-muted-foreground font-normal">
                {fullScript.trim().split(/\s+/).filter(Boolean).length} words · ~
                {Math.ceil(fullScript.trim().split(/\s+/).filter(Boolean).length / 2.5)}s speech
              </span>
            </Label>
            <Textarea
              id="fullScript"
              placeholder={`Write your complete video script here...

Example:
"If you run a TCG store, stop paying 10% in platform fees. 
Here is how we built a custom web platform that synced TCGplayer with Shopify..."`}
              value={fullScript}
              onChange={(e) => setFullScript(e.target.value)}
              className="min-h-[180px] font-mono text-xs leading-relaxed"
            />
          </div>
        </TabsContent>

        {/* Tab 2: 3-Part Hook, Retain, Reward Breakdown */}
        <TabsContent value="structure" className="space-y-3 pt-3">
          <div className="space-y-1.5">
            <Label htmlFor="hookText" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              1. Hook (0-3 seconds) — Scroll Stopper
            </Label>
            <Input
              id="hookText"
              placeholder="e.g., TCGplayer just took $10,000 from this store last year."
              value={hookText}
              onChange={(e) => setHookText(e.target.value)}
              className="text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="retainText" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              2. Retain (4-20 seconds) — Problem & Value Story
            </Label>
            <Textarea
              id="retainText"
              placeholder="e.g., You're paying 8.95% fees plus listing fees. On $100K sales, that's $10K lost profit..."
              value={retainText}
              onChange={(e) => setRetainText(e.target.value)}
              className="text-xs min-h-[70px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rewardText" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              3. Reward (21-30s+) — Takeaway & CTA
            </Label>
            <Textarea
              id="rewardText"
              placeholder="e.g., Build your own custom website. DM me 'TCG' to see how."
              value={rewardText}
              onChange={(e) => setRewardText(e.target.value)}
              className="text-xs min-h-[60px]"
            />
          </div>
        </TabsContent>

        {/* Tab 3: B-Roll & Visual Shot List */}
        <TabsContent value="broll" className="space-y-3 pt-3">
          <div className="space-y-1.5">
            <Label htmlFor="brollNotes" className="text-xs font-semibold flex items-center gap-1">
              <Video className="h-3.5 w-3.5 text-amber-500" />
              Visual Shot List & Camera Directions
            </Label>
            <Textarea
              id="brollNotes"
              placeholder={`List the visual scenes to record for this Reel:

• [0-3s] Split screen: Sadid & Rafi coding UI designs
• [4-10s] Screen recording: Live TCG website inventory sync
• [10-20s] Talking head with mic in office
• [20-30s] B-roll of TCG cards & packing orders`}
              value={brollNotes}
              onChange={(e) => setBrollNotes(e.target.value)}
              className="min-h-[160px] text-xs font-mono"
            />
          </div>
        </TabsContent>

        {/* Tab 4: On-Screen Text & Audio Cues */}
        <TabsContent value="overlays" className="space-y-3 pt-3">
          <div className="space-y-1.5">
            <Label htmlFor="textOverlays" className="text-xs font-semibold flex items-center gap-1">
              <Type className="h-3.5 w-3.5 text-blue-500" />
              On-Screen Text & Captions Plan
            </Label>
            <Textarea
              id="textOverlays"
              placeholder="e.g., Overlay 1: '10% FEES LOST' (Red text, 0-3s)&#10;Overlay 2: 'AUTOMATED INVENTORY' (Green text, 10-15s)"
              value={textOverlays}
              onChange={(e) => setTextOverlays(e.target.value)}
              className="text-xs min-h-[75px]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="audioCues" className="text-xs font-semibold flex items-center gap-1">
              <Music className="h-3.5 w-3.5 text-purple-500" />
              Audio & Background Music Cues
            </Label>
            <Input
              id="audioCues"
              placeholder="e.g., Trending tech synth audio / Voiceover style: Energetic & clear"
              value={audioCues}
              onChange={(e) => setAudioCues(e.target.value)}
              className="text-xs"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
