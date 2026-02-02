import { Project } from "@/lib/services/projects"
import { formatDistanceToNow } from "date-fns"

interface ProjectHeaderProps {
    project: Project
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
    return (
        <div className="space-y-4 max-w-3xl">
            <div className="space-y-2">
                <h1 className="text-4xl font-medium tracking-tight text-foreground font-humanist">
                    {project.name}
                </h1>
                {project.description && (
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                        {project.description}
                    </p>
                )}
            </div>

            {/* Metadata Row - Quiet, no icons unless necessary */}
            <div className="flex items-center gap-6 text-sm text-muted-foreground/60 font-medium pt-2">
                <div className="flex items-center gap-2">
                    <span className="uppercase tracking-wider text-[10px]">Updated</span>
                    <span>{formatDistanceToNow(new Date(project.updated_at || project.created_at))} ago</span>
                </div>

                {project.target_date && (
                    <div className="flex items-center gap-2">
                        <span className="uppercase tracking-wider text-[10px]">Target</span>
                        <span>{new Date(project.target_date).toLocaleDateString()}</span>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span className="uppercase tracking-wider text-[10px]">Owner</span>
                    <span>Me</span>
                </div>
            </div>
        </div>
    )
}
