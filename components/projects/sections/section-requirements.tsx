"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export interface Requirement {
    id: string
    text: string
    is_completed: boolean
}

interface SectionRequirementsProps {
    initialRequirements: Requirement[]
    onChange: (requirements: Requirement[]) => void
}

export function SectionRequirements({ initialRequirements, onChange }: SectionRequirementsProps) {
    const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements || [])
    const [newItem, setNewItem] = useState("")

    const updateRequirements = (newReqs: Requirement[]) => {
        setRequirements(newReqs)
        onChange(newReqs)
    }

    const addItem = () => {
        if (!newItem.trim()) return
        const newReqs = [...requirements, { id: crypto.randomUUID(), text: newItem, is_completed: false }]
        updateRequirements(newReqs)
        setNewItem("")
    }

    const toggleItem = (id: string) => {
        const newReqs = requirements.map(r => r.id === id ? { ...r, is_completed: !r.is_completed } : r)
        updateRequirements(newReqs)
    }

    const deleteItem = (id: string) => {
        const newReqs = requirements.filter(r => r.id !== id)
        updateRequirements(newReqs)
    }

    return (
        <section id="requirements" className="space-y-4">
            <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight">2. Client Requirements</h2>
                <p className="text-sm text-muted-foreground">The "Conditions". Non-negotiables and deadlines.</p>
            </div>

            <div className="space-y-3 p-4 border rounded-md bg-background/50">
                {requirements.map(req => (
                    <div key={req.id} className="flex items-center gap-3 group">
                        <Checkbox
                            checked={req.is_completed}
                            onCheckedChange={() => toggleItem(req.id)}
                        />
                        <span className={`flex-1 text-sm ${req.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                            {req.text}
                        </span>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteItem(req.id)}>
                            <X className="h-3 w-3 text-muted-foreground" />
                        </Button>
                    </div>
                ))}

                <div className="flex items-center gap-2 pt-2">
                    <Input
                        placeholder="Add requirement..."
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                        className="h-8 text-sm"
                    />
                    <Button size="sm" variant="secondary" onClick={addItem}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Separator className="my-8 opacity-50" />
        </section>
    )
}
