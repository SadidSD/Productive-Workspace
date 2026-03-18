import { getTasks } from "@/lib/services/tasks"
import { getWorkspaces } from "@/lib/services/workspaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { TaskList } from "@/components/tasks/task-list"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export default async function TasksPage() {
    const supabase = await createClient()
    const cookieStore = await cookies()
    const selectedId = cookieStore.get('workspace_id')?.value

    const workspaces = await getWorkspaces(supabase)
    const currentWorkspace = workspaces.find(w => w.id === selectedId) || workspaces[0]

    if (!currentWorkspace) return <div>Loading...</div>

    const tasks = await getTasks(currentWorkspace.id, supabase)

    const statusColors = {
        todo: "bg-slate-100 text-slate-700",
        in_progress: "bg-blue-100 text-blue-700",
        review: "bg-purple-100 text-purple-700",
        done: "bg-green-100 text-green-700",
    }

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">Active Tasks</h2>
                        <p className="text-muted-foreground mt-1">
                            Your execution queue across all projects.
                        </p>
                    </div>
                    <CreateTaskDialog workspaceId={currentWorkspace.id} />

                </div>

                <div className="space-y-4">
                    <TaskList initialTasks={tasks} workspaceId={currentWorkspace.id} />
                </div>
            </div>
        </div>
    )
}
