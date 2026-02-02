"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WorkspaceMember } from "@/lib/services/workspaces"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { Plus, X, Maximize2, Calendar, Clock, User as UserIcon, Activity, CheckCircle2 } from "lucide-react"

export interface WorkflowRow {
    id: string
    sector: string
    assigned_user_id: string
    status: 'Not Started' | 'In Progress' | 'Blocked' | 'Review' | 'Done'
    description?: string
    startDate?: string
    endDate?: string
    actualDate?: string
}

interface SectionWorkflowProps {
    initialRows: WorkflowRow[]
    members: WorkspaceMember[]
    onChange: (rows: WorkflowRow[]) => void
}

export function SectionWorkflow({ initialRows, members, onChange }: SectionWorkflowProps) {
    // Default rows if empty
    const defaultRows: WorkflowRow[] = [
        { id: "1", sector: "FRONTEND", assigned_user_id: "", status: "Not Started" },
        { id: "2", sector: "BACKEND", assigned_user_id: "", status: "Not Started" },
        { id: "3", sector: "DESIGN", assigned_user_id: "", status: "Not Started" },
    ]

    const [rows, setRows] = useState<WorkflowRow[]>(initialRows?.length ? initialRows : defaultRows)
    const [newSector, setNewSector] = useState("")
    const [activeRowId, setActiveRowId] = useState<string | null>(null)

    const updateRows = (newRows: WorkflowRow[]) => {
        setRows(newRows)
        onChange(newRows)
    }

    const updateRow = (id: string, updates: Partial<WorkflowRow>) => {
        updateRows(rows.map(r => r.id === id ? { ...r, ...updates } : r))
    }

    const deleteRow = (id: string) => {
        updateRows(rows.filter(r => r.id !== id))
    }

    const addRow = () => {
        if (!newSector.trim()) return
        const newRow: WorkflowRow = {
            id: crypto.randomUUID(),
            sector: newSector.toUpperCase(),
            assigned_user_id: "",
            status: "Not Started"
        }
        updateRows([...rows, newRow])
        setNewSector("")
    }

    const cycleStatus = (id: string, currentStatus: WorkflowRow['status']) => {
        const flow: WorkflowRow['status'][] = ['Not Started', 'In Progress', 'Review', 'Done', 'Blocked']
        const currentIndex = flow.indexOf(currentStatus)
        const nextStatus = flow[(currentIndex + 1) % flow.length]
        updateRow(id, { status: nextStatus })
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Done': return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
            case 'In Progress': return 'text-blue-500 border-blue-500/30 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse-slow'
            case 'Blocked': return 'text-red-500 border-red-500/30 bg-red-500/5'
            case 'Review': return 'text-amber-500 border-amber-500/30 bg-amber-500/5'
            default: return 'text-muted-foreground border-border/50 bg-muted/20'
        }
    }

    const formatStatus = (status: string) => `[ ${status.toUpperCase().replace(' ', '_')} ]`

    const getMember = (userId: string) => members.find(m => m.user_id === userId)

    const activeRow = rows.find(r => r.id === activeRowId)

    return (
        <section id="workflow" className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">4. Workflow</h2>
                <p className="text-sm text-muted-foreground">Command Center. Hover to open details.</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {rows.map((row) => (
                    <div
                        key={row.id}
                        className="group relative flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-card hover:shadow-sm transition-all duration-300"
                    >
                        {/* Left: Indicator & Sector */}
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`w-1 h-8 rounded-full ${row.status === 'In Progress' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-muted'}`} />

                            <div className="flex items-center gap-3">
                                <Input
                                    value={row.sector}
                                    onChange={(e) => updateRow(row.id, { sector: e.target.value.toUpperCase() })}
                                    className="font-bold tracking-tight text-lg border-transparent hover:border-input focus:border-input bg-transparent px-2 -ml-2 w-auto min-w-[150px] uppercase text-foreground/80"
                                />
                                {/* Open Details Button (Hover Only) */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveRowId(row.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-all text-xs text-muted-foreground flex items-center gap-1 h-7 px-2 bg-muted/30 hover:bg-muted/50"
                                >
                                    <Maximize2 className="h-3 w-3" />
                                    OPEN
                                </Button>
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-6">

                            {/* HUD Status Button */}
                            <button
                                onClick={() => cycleStatus(row.id, row.status)}
                                className={`font-mono text-xs font-medium px-3 py-1.5 rounded border transition-all duration-300 hover:scale-105 active:scale-95 ${getStatusStyles(row.status)}`}
                            >
                                {formatStatus(row.status)}
                            </button>

                            {/* Separator */}
                            <div className="h-8 w-px bg-border/40" />

                            {/* Assignee Avatar */}
                            <Select
                                value={row.assigned_user_id}
                                onValueChange={(val) => updateRow(row.id, { assigned_user_id: val })}
                            >
                                <SelectTrigger className="w-10 h-10 rounded-full border-0 p-0 focus:ring-0 shadow-none hover:opacity-80 transition-opacity overflow-hidden ring-2 ring-transparent bg-muted/50 data-[state=open]:ring-primary/20">
                                    {row.assigned_user_id && getMember(row.assigned_user_id) ? (
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={getMember(row.assigned_user_id)?.profile.avatar_url} />
                                            <AvatarFallback>{(getMember(row.assigned_user_id)?.profile.full_name?.[0] || "U").toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground group-hover:text-foreground">
                                            <span className="sr-only">Assign</span>
                                            <UserIcon className="h-4 w-4" />
                                        </div>
                                    )}
                                </SelectTrigger>
                                <SelectContent align="end">
                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                    {members.map(m => (
                                        <SelectItem key={m.user_id} value={m.user_id}>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-5 w-5">
                                                    <AvatarImage src={m.profile.avatar_url} />
                                                    <AvatarFallback className="text-[10px]">{(m.profile.full_name?.[0] || "U").toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span>{m.profile.full_name || "User"}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Delete Action (Hover only) */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                                onClick={() => deleteRow(row.id)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Add New Card */}
                <div className="relative flex items-center p-4 rounded-xl border border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-1 h-8 rounded-full bg-muted" />
                        <Input
                            value={newSector}
                            onChange={(e) => setNewSector(e.target.value)}
                            placeholder="ADD SECTOR..."
                            className="font-bold tracking-tight text-lg border-transparent bg-transparent px-2 -ml-2 w-auto uppercase placeholder:text-muted-foreground/40"
                            onKeyDown={(e) => e.key === 'Enter' && addRow()}
                        />
                    </div>
                    <Button size="icon" variant="ghost" className="h-10 w-10 text-muted-foreground" onClick={addRow} disabled={!newSector}>
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Detailed View Sheet */}
            <Sheet open={!!activeRowId} onOpenChange={(open) => !open && setActiveRowId(null)}>
                <SheetContent className="sm:max-w-xl w-full border-l shadow-2xl bg-background/95 backdrop-blur-sm p-0">
                    {activeRow && (
                        <div className="h-full flex flex-col">
                            {/* Sheet Header */}
                            <div className="p-6 border-b space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest font-mono">
                                        <Activity className="h-3 w-3" />
                                        Workflow Detail
                                    </div>
                                    <h2 className="text-3xl font-bold tracking-tight uppercase">{activeRow.sector}</h2>
                                </div>

                                {/* Key Properties Grid */}
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">Status</label>
                                        <div className="w-full">
                                            <Select
                                                value={activeRow.status}
                                                onValueChange={(val: any) => updateRow(activeRow.id, { status: val })}
                                            >
                                                <SelectTrigger className="w-full h-9 bg-muted/30 border-muted-foreground/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Not Started">Not Started</SelectItem>
                                                    <SelectItem value="In Progress">In Progress</SelectItem>
                                                    <SelectItem value="Blocked">Blocked</SelectItem>
                                                    <SelectItem value="Review">Review</SelectItem>
                                                    <SelectItem value="Done">Done</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground">Assignee</label>
                                        <div className="w-full">
                                            <Select
                                                value={activeRow.assigned_user_id}
                                                onValueChange={(val) => updateRow(activeRow.id, { assigned_user_id: val })}
                                            >
                                                <SelectTrigger className="w-full h-9 bg-muted/30 border-muted-foreground/20">
                                                    <div className="flex items-center gap-2">
                                                        {activeRow.assigned_user_id && getMember(activeRow.assigned_user_id) ? (
                                                            <>
                                                                <Avatar className="h-5 w-5">
                                                                    <AvatarImage src={getMember(activeRow.assigned_user_id)?.profile.avatar_url} />
                                                                    <AvatarFallback className="text-[10px]">{(getMember(activeRow.assigned_user_id)?.profile.full_name?.[0] || "U").toUpperCase()}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="truncate text-xs">{getMember(activeRow.assigned_user_id)?.profile.full_name || "Assigned"}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-muted-foreground">Unassigned</span>
                                                        )}
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Unassigned</SelectItem>
                                                    {members.map(m => (
                                                        <SelectItem key={m.user_id} value={m.user_id}>
                                                            <div className="flex items-center gap-2">
                                                                <Avatar className="h-5 w-5">
                                                                    <AvatarImage src={m.profile.avatar_url} />
                                                                    <AvatarFallback className="text-[10px]">{(m.profile.full_name?.[0] || "U").toUpperCase()}</AvatarFallback>
                                                                </Avatar>
                                                                <span className="text-sm">{m.profile.full_name || "User"}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3" /> Start Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={activeRow.startDate || ''}
                                            onChange={(e) => updateRow(activeRow.id, { startDate: e.target.value })}
                                            className="h-9 bg-muted/30 border-muted-foreground/20 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" /> Target Date
                                        </label>
                                        <Input
                                            type="date"
                                            value={activeRow.endDate || ''}
                                            onChange={(e) => updateRow(activeRow.id, { endDate: e.target.value })}
                                            className="h-9 bg-muted/30 border-muted-foreground/20 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                                            <CheckCircle2 className="h-3 w-3" /> Actual Finish
                                        </label>
                                        <Input
                                            type="date"
                                            value={activeRow.actualDate || ''}
                                            onChange={(e) => updateRow(activeRow.id, { actualDate: e.target.value })}
                                            className="h-9 bg-muted/30 border-muted-foreground/20 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sheet Body */}
                            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                                <div className="space-y-2 h-full flex flex-col">
                                    <label className="text-sm font-semibold tracking-tight">Execution Notes & Description</label>
                                    <Textarea
                                        value={activeRow.description || ''}
                                        onChange={(e) => updateRow(activeRow.id, { description: e.target.value })}
                                        placeholder="Add detailed execution plans, blockers, or specific requirements for this sector..."
                                        className="flex-1 min-h-[300px] resize-none bg-muted/20 border-border/50 focus:border-ring text-base leading-relaxed p-4"
                                    />
                                    <p className="text-xs text-muted-foreground text-right pt-2">Changes save automatically.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            <Separator className="my-8 opacity-50" />
        </section>
    )
}
