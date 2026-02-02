import { getTasks } from "@/lib/services/tasks"
import { getWorkspaces } from "@/lib/services/workspaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"

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
                    {tasks.map(task => (
                        <Card key={task.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-3 h-3 rounded-full ${task.priority === 'high' ? 'bg-red-400' : 'bg-slate-300'}`} />
                                    <div>
                                        <div className="font-medium">{task.title}</div>
                                        <div className="text-xs text-muted-foreground line-clamp-1">{task.description}</div>
                                    </div>
                                </div>
                                <Badge variant="outline" className={statusColors[task.status] || ""}>
                                    {task.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
