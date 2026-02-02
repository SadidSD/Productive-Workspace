import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Project } from "@/lib/services/projects"

interface ProjectContextBarProps {
    project: Project
    workspaceName: string
}

export function ProjectContextBar({ project, workspaceName }: ProjectContextBarProps) {
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60 font-medium tracking-wide uppercase select-none">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
                {workspaceName}
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <Link href="/dashboard/projects" className="hover:text-foreground transition-colors">
                Projects
            </Link>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <span className="text-foreground/80">{project.name}</span>

            <div className="ml-auto flex items-center gap-2">
                <span className="opacity-50">Status:</span>
                <span className="text-foreground/80">{project.status}</span>
            </div>
        </div>
    )
}
