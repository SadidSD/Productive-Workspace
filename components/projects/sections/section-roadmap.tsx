"use client"

import { Separator } from "@/components/ui/separator"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"

export interface Milestone {
    id: string
    phase: string
    timeline: string
    status: 'pending' | 'active' | 'done'
}

interface SectionRoadmapProps {
    initialMilestones: Milestone[]
    onChange: (milestones: Milestone[]) => void
}

export function SectionRoadmap({ initialMilestones, onChange }: SectionRoadmapProps) {
    const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones || [])
    const [newMilestone, setNewMilestone] = useState<Partial<Milestone>>({ phase: "", timeline: "" })

    const updateMilestones = (newMilestones: Milestone[]) => {
        setMilestones(newMilestones)
        onChange(newMilestones)
    }

    const handleAdd = () => {
        if (!newMilestone.phase) return

        const m: Milestone = {
            id: crypto.randomUUID(),
            phase: newMilestone.phase,
            timeline: newMilestone.timeline || "TBD",
            status: "pending"
        }

        updateMilestones([...milestones, m])
        setNewMilestone({ phase: "", timeline: "" })
    }

    const removeMilestone = (id: string) => {
        updateMilestones(milestones.filter(m => m.id !== id))
    }

    const updateMilestone = (id: string, updates: Partial<Milestone>) => {
        updateMilestones(milestones.map(m => m.id === id ? { ...m, ...updates } : m))
    }

    const cycleStatus = (id: string, currentStatus: Milestone['status']) => {
        const nextStatus: Record<string, Milestone['status']> = {
            'pending': 'active',
            'active': 'done',
            'done': 'pending'
        }
        updateMilestone(id, { status: nextStatus[currentStatus] })
    }

    return (
        <section id="roadmap" className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">3. Roadmap</h2>
                <p className="text-sm text-muted-foreground">The "When". High-level sequence. Click the dot to update status.</p>
            </div>

            <div className="relative pl-2">
                {/* Continuous vertical line background */}
                <div className="absolute left-[1.35rem] top-2 bottom-8 w-px bg-border/60" />

                <div className="space-y-6 relative">
                    {milestones.map((m) => (
                        <div key={m.id} className="flex gap-6 group items-start">
                            {/* Interactive Status Node */}
                            <button
                                onClick={() => cycleStatus(m.id, m.status)}
                                className="relative z-10 flex-shrink-0 mt-1.5 focus:outline-none transition-transform active:scale-95"
                            >
                                {m.status === 'done' && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm ring-4 ring-background">
                                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground" />
                                        </svg>
                                    </div>
                                )}
                                {m.status === 'active' && (
                                    <div className="relative w-5 h-5 flex items-center justify-center ring-4 ring-background">
                                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                                        <div className="absolute inset-0 bg-blue-500/10 rounded-full border border-blue-500/50" />
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                    </div>
                                )}
                                {m.status === 'pending' && (
                                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 bg-background hover:border-muted-foreground/60 transition-colors ring-4 ring-background" />
                                )}
                            </button>

                            {/* Content */}
                            <div className="flex-1 flex items-start gap-4 -mt-1">
                                <div className="grid gap-1 flex-1">
                                    <Input
                                        value={m.phase}
                                        onChange={(e) => updateMilestone(m.id, { phase: e.target.value })}
                                        className={`h-auto p-0 border-none shadow-none text-lg font-medium focus-visible:ring-0 px-0 rounded-none transition-all ${m.status === 'done' ? 'text-muted-foreground/60 line-through decoration-border' : 'text-foreground'}`}
                                        placeholder="Phase Name"
                                    />
                                    <Input
                                        value={m.timeline}
                                        onChange={(e) => updateMilestone(m.id, { timeline: e.target.value })}
                                        className="h-auto p-0 border-none shadow-none text-xs text-muted-foreground/70 uppercase tracking-wider font-medium focus-visible:ring-0 px-0 rounded-none"
                                        placeholder="Add timeline..."
                                    />
                                </div>

                                {/* Delete Action */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 -mr-2 text-muted-foreground/40 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeMilestone(m.id)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {/* Add New Row */}
                    <div className="flex gap-6 items-start opacity-60 hover:opacity-100 transition-opacity">
                        <div className="relative z-10 flex-shrink-0 mt-2">
                            <div className="w-4 h-4 rounded-full border border-dashed border-muted-foreground bg-background ring-4 ring-background ml-0.5" />
                        </div>

                        <div className="flex-1 flex items-start gap-3">
                            <div className="grid gap-2 flex-1">
                                <Input
                                    value={newMilestone.phase}
                                    onChange={(e) => setNewMilestone({ ...newMilestone, phase: e.target.value })}
                                    className="font-medium h-9 bg-muted/30 border-transparent focus:bg-background focus:border-input transition-all placeholder:text-muted-foreground/50"
                                    placeholder="Add next milestone..."
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                />
                            </div>
                            <Button size="icon" variant="secondary" className="h-9 w-9" onClick={handleAdd} disabled={!newMilestone.phase}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <Separator className="my-8 opacity-50" />
        </section>
    )
}
