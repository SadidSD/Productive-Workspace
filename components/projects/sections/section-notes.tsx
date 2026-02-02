"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Info, Zap, Trash2, Plus } from "lucide-react"

export interface Note {
    id: string
    content: string
    created_at: string
    type: 'feedback' | 'change' | 'risk' | 'decision'
}

interface SectionNotesProps {
    initialNotes: Note[]
    onChange: (notes: Note[]) => void
}

export function SectionNotes({ initialNotes, onChange }: SectionNotesProps) {
    const [notes, setNotes] = useState<Note[]>(initialNotes?.length ? initialNotes : [])
    const [newNoteContent, setNewNoteContent] = useState("")
    const [newNoteType, setNewNoteType] = useState<Note['type']>('feedback')

    const updateNotes = (updatedNotes: Note[]) => {
        setNotes(updatedNotes)
        onChange(updatedNotes)
    }

    const addNote = () => {
        if (!newNoteContent.trim()) return

        const newNote: Note = {
            id: crypto.randomUUID(),
            content: newNoteContent,
            created_at: new Date().toISOString(),
            type: newNoteType
        }

        // Add to top
        updateNotes([newNote, ...notes])
        setNewNoteContent("")
    }

    const deleteNote = (id: string) => {
        updateNotes(notes.filter(n => n.id !== id))
    }

    const getTypeStyles = (type: Note['type']) => {
        switch (type) {
            case 'risk': return 'text-red-500 bg-red-500/10 border-red-500/20'
            case 'decision': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
            case 'change': return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
            case 'feedback': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
            default: return 'text-muted-foreground bg-muted border-border'
        }
    }

    const getTypeIcon = (type: Note['type']) => {
        switch (type) {
            case 'risk': return <AlertTriangle className="h-3 w-3" />
            case 'decision': return <CheckCircle className="h-3 w-3" />
            case 'change': return <Zap className="h-3 w-3" />
            case 'feedback': return <Info className="h-3 w-3" />
        }
    }

    return (
        <section id="notes" className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-red-600/90">5. Important Notes</h2>
                <p className="text-sm text-muted-foreground">The "Digital Log". Volatile intelligence (Decisions, Risks, Changes).</p>
            </div>

            {/* Input Area */}
            <div className="flex gap-3 items-center p-1">
                <Select
                    value={newNoteType}
                    onValueChange={(val: any) => setNewNoteType(val)}
                >
                    <SelectTrigger className="w-[140px] h-10 bg-background border-muted-foreground/20">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="decision">Decision</SelectItem>
                        <SelectItem value="risk">Risk</SelectItem>
                        <SelectItem value="change">Change</SelectItem>
                    </SelectContent>
                </Select>

                <Input
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Log a new entry..."
                    className="flex-1 h-10"
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                />

                <Button onClick={addNote} size="icon" disabled={!newNoteContent} className="h-10 w-10 shrink-0">
                    <Plus className="h-5 w-5" />
                </Button>
            </div>

            {/* Log Feed */}
            <div className="space-y-3 pl-1">
                {notes.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground/40 text-sm border border-dashed rounded-lg bg-muted/5">
                        No log entries yet.
                    </div>
                )}

                {notes.map(note => (
                    <div key={note.id} className="group flex items-start gap-4 p-4 border rounded-xl bg-card hover:bg-card/80 transition-all relative">
                        {/* Type Indicator */}
                        <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full border ${getTypeStyles(note.type)}`}>
                            {getTypeIcon(note.type)}
                        </div>

                        <div className="flex-1 space-y-1 pt-0.5">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${getTypeStyles(note.type).split(' ')[0]}`}>
                                    {note.type}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground/60">
                                    • {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed text-foreground/90">{note.content}</p>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNote(note.id)}
                            className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                ))}
            </div>
            <Separator className="my-8 opacity-50" />
        </section>
    )
}
