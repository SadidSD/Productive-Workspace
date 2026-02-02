"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { Editor } from "@/components/editor/editor"
import { Separator } from "@/components/ui/separator"

interface SectionBlueprintProps {
    initialContent: Record<string, unknown> | null
    onChange: (content: Record<string, unknown>) => void
}

export function SectionBlueprint({ initialContent, onChange }: SectionBlueprintProps) {
    const [isExpanded, setIsExpanded] = useState(true) // Default to expanded for visibility, or false if preferred

    return (
        <section id="blueprint" className="space-y-4">
            <div
                className="space-y-1 cursor-pointer group select-none flex items-start gap-2"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className={`mt-1.5 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">1. Blueprint</h2>
                    <p className="text-sm text-muted-foreground">The "Why" and "What". System architecture, core idea, constraints.</p>
                </div>
            </div>

            {isExpanded && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200 pl-4 border-l-2 border-muted/30">
                    <Editor
                        initialContent={initialContent}
                        onChange={onChange}
                    />
                </div>
            )}
            <Separator className="my-8 opacity-50" />
        </section>
    )
}
