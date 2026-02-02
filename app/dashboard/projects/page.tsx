import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getProjects } from "@/lib/services/projects"
import { getWorkspaces } from "@/lib/services/workspaces"
import { CreateProjectDialog } from "@/components/projects/create-project-dialog"
import { ProjectCard } from "@/components/projects/project-card"
import { ProjectList } from "@/components/projects/project-list"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export default async function ProjectsPage() {
    const supabase = await createClient()
    const cookieStore = await cookies()
    const selectedId = cookieStore.get('workspace_id')?.value

    const workspaces = await getWorkspaces(supabase)
    const currentWorkspace = workspaces.find(w => w.id === selectedId) || workspaces[0]

    if (!currentWorkspace) {
        return <div>Please create a workspace first.</div>
    }

    const projects = await getProjects(currentWorkspace.id, supabase)

    return (
        <div className="max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Projects</h2>
                    <p className="text-muted-foreground mt-1">Execution containers for your systems.</p>
                </div>
                <CreateProjectDialog workspaceId={currentWorkspace.id}>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Button>
                </CreateProjectDialog>
            </div>

            <ProjectList initialProjects={projects} />
        </div>
    )
}
