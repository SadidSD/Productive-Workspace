"use client"

import { useState } from "react"
import { ResearchInquiry, ResearchInsight, updateResearch } from "@/lib/services/research"
import { useDebouncedCallback } from "use-debounce"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Plus, ExternalLink, Trash2, Signal, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Editor } from "@/components/editor/editor"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ResearchShellProps {
    initialInquiry: ResearchInquiry
}

export function ResearchShell({ initialInquiry }: ResearchShellProps) {
    const [inquiry, setInquiry] = useState({
        ...initialInquiry,
        insights: initialInquiry.insights || []
    })
    const [isInsightOpen, setIsInsightOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Autosave Logic
    const debouncedUpdate = useDebouncedCallback(async (updates: Partial<ResearchInquiry>) => {
        setIsSaving(true)
        await updateResearch(inquiry.id, updates)
        setTimeout(() => setIsSaving(false), 800)
    }, 1000)

    const handleUpdate = (updates: Partial<ResearchInquiry>) => {
        const newInquiry = { ...inquiry, ...updates }
        setInquiry(newInquiry)
        debouncedUpdate(updates)
    }

    // New Insight Form State
    const [newInsight, setNewInsight] = useState<Partial<ResearchInsight>>({
        confidence: 'medium',
        statement: '',
        context: '',
        evidence_url: ''
    })

    // Layer 1: Context Header Status Colors
    const statusColors = {
        exploring: "text-blue-600 bg-blue-50 border-blue-200",
        synthesizing: "text-amber-600 bg-amber-50 border-amber-200",
        archived: "text-muted-foreground bg-muted border-muted-foreground/20"
    }

    const confidenceColors = {
        low: "bg-slate-100 text-slate-600",
        medium: "bg-blue-50 text-blue-600",
        high: "bg-emerald-50 text-emerald-600"
    }

    const addInsight = () => {
        if (!newInsight.statement) return

        const insight: ResearchInsight = {
            id: crypto.randomUUID(),
            statement: newInsight.statement!,
            context: newInsight.context || '',
            evidence_url: newInsight.evidence_url,
            confidence: newInsight.confidence as 'low' | 'medium' | 'high'
        }

        const updatedInsights = [insight, ...inquiry.insights]
        handleUpdate({ insights: updatedInsights })

        setNewInsight({ confidence: 'medium', statement: '', context: '', evidence_url: '' })
        setIsInsightOpen(false)
    }

    const deleteInsight = (id: string) => {
        const updatedInsights = inquiry.insights.filter(i => i.id !== id)
        handleUpdate({ insights: updatedInsights })
    }

    return (
        <div className="min-h-screen bg-[#FBFBFB] font-sans selection:bg-stone-200">
            {/* Layer 1: Context Header (Orientation Only) */}
            <header className="sticky top-0 z-10 bg-[#FBFBFB]/80 backdrop-blur-md border-b border-stone-200/50">
                <div className="max-w-4xl mx-auto px-12 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/dashboard/research"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3">
                                <h1 className="text-sm font-semibold text-foreground tracking-wide uppercase">
                                    {inquiry.title}
                                </h1>
                                <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider", statusColors[inquiry.status])}>
                                    {inquiry.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                {inquiry.tags.map(tag => (
                                    <span key={tag} className="text-[10px] text-muted-foreground font-medium">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono flex items-center gap-1.5 transition-colors">
                        {isSaving ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin text-amber-500" />
                                <span className="text-amber-500">Saving...</span>
                            </>
                        ) : (
                            <>
                                <Clock className="w-3 h-3" />
                                Autosaved
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-12 py-12 space-y-16">

                {/* Layer 2: Question & Scope (The Anchor) */}
                <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="grid grid-cols-[120px_1fr] gap-8">
                        <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest pt-1.5">
                            Inquiry
                        </div>
                        <div className="space-y-4">
                            <Textarea
                                value={inquiry.question}
                                onChange={(e) => handleUpdate({ question: e.target.value })}
                                placeholder="What are we trying to understand?"
                                className="min-h-[80px] text-xl font-medium leading-relaxed bg-transparent border-none p-0 focus-visible:ring-0 resize-none placeholder:text-muted-foreground/30"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-[120px_1fr] gap-8">
                        <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest pt-1.5">
                            Scope
                        </div>
                        <div className="space-y-4">
                            <Textarea
                                value={inquiry.scope}
                                onChange={(e) => handleUpdate({ scope: e.target.value })}
                                placeholder="What is explicitly out of scope?"
                                className="min-h-[60px] text-base text-stone-600 leading-relaxed bg-transparent border-none p-0 focus-visible:ring-0 resize-none placeholder:text-muted-foreground/30"
                            />
                        </div>
                    </div>
                </section>

                <Separator className="bg-stone-200/60" />

                {/* Layer 3: Research Body (The Lab) */}
                <section className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
                    <div className="flex flex-col gap-6">
                        <div className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
                            Body
                        </div>
                        <div className="min-h-[400px]">
                            <Editor
                                initialContent={inquiry.content}
                                onChange={(content) => handleUpdate({ content })}
                            />
                        </div>
                    </div>
                </section>

                <Separator className="bg-stone-200/60" />

                {/* Layer 4: Signals & Insights */}
                <section className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                            <Signal className="w-3 h-3" />
                            Signals & Insights
                        </h3>

                        <Dialog open={isInsightOpen} onOpenChange={setIsInsightOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 border-dashed">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Insight
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Extract Insight</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Insight Statement</label>
                                        <Textarea
                                            placeholder="Atomic truth or pattern observed..."
                                            value={newInsight.statement}
                                            onChange={(e) => setNewInsight({ ...newInsight, statement: e.target.value })}
                                            className="font-medium"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Context / Source</label>
                                            <Input
                                                placeholder="Where does this appear?"
                                                value={newInsight.context}
                                                onChange={(e) => setNewInsight({ ...newInsight, context: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Confidence</label>
                                            <Select
                                                value={newInsight.confidence}
                                                onValueChange={(v) => setNewInsight({ ...newInsight, confidence: v as any })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">Low</SelectItem>
                                                    <SelectItem value="medium">Medium</SelectItem>
                                                    <SelectItem value="high">High</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Evidence Link <span className="text-muted-foreground font-normal">(Optional)</span></label>
                                        <Input
                                            placeholder="https://..."
                                            value={newInsight.evidence_url}
                                            onChange={(e) => setNewInsight({ ...newInsight, evidence_url: e.target.value })}
                                        />
                                    </div>
                                    <Button onClick={addInsight} disabled={!newInsight.statement}>Save Insight</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4">
                        {inquiry.insights.length === 0 && (
                            <div className="py-8 text-center border border-dashed rounded-lg text-sm text-stone-400">
                                No insights extracted yet.
                            </div>
                        )}
                        {inquiry.insights.map(insight => (
                            <div key={insight.id} className="group relative p-5 bg-white border border-stone-200 rounded-lg shadow-sm hover:shadow-md transition-all">
                                <button
                                    onClick={() => deleteInsight(insight.id)}
                                    className="absolute top-4 right-4 text-stone-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="space-y-3">
                                    <h4 className="text-base font-semibold text-foreground leading-snug pr-8">
                                        {insight.statement}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5 font-medium text-stone-500">
                                            {insight.context}
                                        </span>
                                        <Separator orientation="vertical" className="h-3" />
                                        <span className={cn("px-1.5 py-0.5 rounded-sm font-medium uppercase tracking-wider text-[9px]", confidenceColors[insight.confidence])}>
                                            {insight.confidence} Confidence
                                        </span>
                                        {insight.evidence_url && (
                                            <>
                                                <Separator orientation="vertical" className="h-3" />
                                                <a
                                                    href={insight.evidence_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    Evidence
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    )
}
