"use client"

import { useState, useEffect } from "react"
import { Project, updateProject } from "@/lib/services/projects"
import { Task } from "@/lib/services/tasks"
import { WorkspaceMember } from "@/lib/services/workspaces"
import { Button } from "@/components/ui/button"
import { SectionBlueprint } from "./sections/section-blueprint"
import { SectionRequirements } from "./sections/section-requirements"
import { SectionRoadmap } from "./sections/section-roadmap"
import { SectionWorkflow } from "./sections/section-workflow"
import { SectionNotes } from "./sections/section-notes"
import { SectionInspo } from "./sections/section-inspo"
import { useDebouncedCallback } from "use-debounce"
import { toast } from "sonner"

interface ProjectShellProps {
    project: Project
    tasks: Task[]
    members: WorkspaceMember[]
    header: React.ReactNode
    contextBar: React.ReactNode
}

export function ProjectShell({ project, tasks, members, header, contextBar }: ProjectShellProps) {
    const [localContent, setLocalContent] = useState<Record<string, unknown>>(project.content_json as Record<string, unknown> || {})
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')

    // Load from localStorage logic removed (Strict Supabase Mode)

    // Generic save handler
    const debouncedSave = useDebouncedCallback(async (fullContent: Record<string, unknown>) => {
        setSaveStatus('saving')
        try {
            await updateProject(project.id, { content_json: fullContent })
            setSaveStatus('saved')
        } catch (error) {
            console.error("Failed to save:", error)
            setSaveStatus('unsaved')
            toast.error("Failed to save changes")
        }
    }, 1000)

    const handleSectionChange = (sectionKey: string, data: unknown) => {
        setSaveStatus('unsaved')

        const newContent = {
            ...localContent,
            [sectionKey]: data
        }

        setLocalContent(newContent)
        debouncedSave(newContent)
    }

    // Helper for legacy specific handler (refactor blueprint to use handleSectionChange later if needed)
    const handleBlueprintChange = (content: Record<string, unknown>) => {
        handleSectionChange('blueprint', content)
    }

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex flex-col">
            {/* ... Context Bar ... */}
            <div className="px-8 py-3 bg-background/50 backdrop-blur-sm border-b sticky top-0 z-10 flex justify-between items-center">
                {contextBar}
                <div className="flex items-center gap-2">
                    {saveStatus === 'unsaved' && <span className="text-xs text-yellow-500 font-medium tracking-wide">Unsaved</span>}
                    {saveStatus === 'saving' && <span className="text-xs text-muted-foreground animate-pulse tracking-wide">Saving...</span>}
                    {saveStatus === 'saved' && <span className="text-xs text-muted-foreground opacity-50 tracking-wide">Saved</span>}
                </div>
            </div>

            <div className="flex flex-1">
                {/* Main Thinking Surface */}
                <main className="flex-1 transition-all duration-300">
                    <div className="max-w-5xl ml-12 py-12 space-y-12">
                        {/* ... Header ... */}
                        <div className="group relative">
                            {header}
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-border/40" />

                        {/* The Page Body (Structured Sections) */}
                        <div className="min-h-[60vh] space-y-8">
                            <SectionBlueprint
                                initialContent={(localContent.blueprint as Record<string, unknown>) || null}
                                onChange={handleBlueprintChange}
                            />
                            <SectionRequirements
                                initialRequirements={(localContent.requirements as any[]) || []}
                                onChange={(reqs) => handleSectionChange('requirements', reqs)}
                            />
                            <SectionRoadmap
                                initialMilestones={(localContent.roadmap as any[]) || []}
                                onChange={(milestones) => handleSectionChange('roadmap', milestones)}
                            />
                            <SectionWorkflow
                                initialRows={(localContent.workflow as any[]) || []}
                                members={members}
                                onChange={(rows) => handleSectionChange('workflow', rows)}
                            />
                            <SectionNotes
                                initialNotes={(localContent.notes as any[]) || []}
                                onChange={(notes) => handleSectionChange('notes', notes)}
                            />
                            <SectionInspo
                                initialItems={(localContent.inspiration as any[]) || []}
                                onChange={(items) => handleSectionChange('inspiration', items)}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
