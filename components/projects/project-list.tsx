"use client"
import { Project } from "@/lib/services/projects"
import { ProjectCard } from "@/components/projects/project-card"

interface ProjectListProps {
    initialProjects: Project[]
}

export function ProjectList({ initialProjects: projects }: ProjectListProps) {
    if (projects.length === 0) {
        return (
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 text-center">
                <h3 className="text-lg font-medium mb-2">No active projects</h3>
                <p className="text-muted-foreground mb-6">Create a project to start tracking your work.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    )
}
