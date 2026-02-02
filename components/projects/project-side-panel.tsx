import { Project } from "@/lib/services/projects"
import { Task } from "@/lib/services/tasks"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckCircle2, Circle, X } from "lucide-react"

interface ProjectSidePanelProps {
    project: Project
    tasks: Task[]
    isOpen: boolean
    onClose: () => void
}

export function ProjectSidePanel({ project, tasks, isOpen, onClose }: ProjectSidePanelProps) {
    if (!isOpen) return null

    return (
        <div className="w-80 border-l bg-background h-[calc(100vh-4rem)] fixed right-0 top-16 bottom-0 z-20 flex flex-col shadow-xl transition-transform animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium text-sm">Context</h3>
                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">
                    {/* Tasks Section */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Linked Tasks
                        </h4>
                        <div className="space-y-2">
                            {tasks.map(task => (
                                <div key={task.id} className="flex items-start gap-2 text-sm group">
                                    {task.status === 'done' ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    )}
                                    <span className={`text-muted-foreground group-hover:text-foreground transition-colors ${task.status === 'done' ? 'line-through opacity-70' : ''}`}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                            {tasks.length === 0 && (
                                <p className="text-xs text-muted-foreground italic">No tasks linked.</p>
                            )}
                        </div>
                    </div>

                    {/* Decisions Section (Placeholder) */}
                    <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                            Decisions
                        </h4>
                        <p className="text-xs text-muted-foreground italic">No decisions recorded.</p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}
