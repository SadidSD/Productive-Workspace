import { getProject } from "@/lib/services/projects"
import { getTasksByProject } from "@/lib/services/tasks"
import { getWorkspaceMembers } from "@/lib/services/workspaces"
import { notFound } from "next/navigation"
import { ProjectContextBar } from "@/components/projects/project-context-bar"
import { ProjectHeader } from "@/components/projects/project-header"
import { ProjectShell } from "@/components/projects/project-shell"
import { createClient } from "@/lib/supabase/server"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Pass authenticated client
    const project = await getProject(id, supabase)

    if (!project) {
        return notFound()
    }

    const tasks = await getTasksByProject(id, supabase)
    const members = await getWorkspaceMembers(project.workspace_id, supabase)

    // We use a client wrapper 'ProjectShell' to handle state like the side panel toggle
    // This allows the page itself to remain a Server Component for data fetching
    return (
        <ProjectShell
            project={project}
            tasks={tasks}
            members={members}
            header={<ProjectHeader project={project} />}
            contextBar={<ProjectContextBar project={project} workspaceName="My Workspace" />}
        />
    )
}
