import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import Link from "next/link"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { getProjects } from "@/lib/services/projects"
import { getTasks } from "@/lib/services/tasks"
import { getWorkspaces } from "@/lib/services/workspaces"
import { ProjectCard } from "@/components/projects/project-card"
import { Layers, Inbox, Gavel, Lightbulb } from "lucide-react"
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"

import { cookies } from "next/headers"

import { TeamWidget } from "@/components/dashboard/team-widget"
import { getWorkspaceMembers } from "@/lib/services/workspaces"

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const cookieStore = await cookies()
    const selectedId = cookieStore.get('workspace_id')?.value

    // Fetch Data
    const workspaces = await getWorkspaces(supabase)
    const currentWorkspace = workspaces.find(w => w.id === selectedId) || workspaces[0]

    // Empty State for New Users
    if (!currentWorkspace) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight">Welcome to Kortex</h2>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Your workspace is your command center. Create one to start managing projects, systems, and insights.
                    </p>
                </div>
                <CreateWorkspaceDialog>
                    <Button size="lg">Create First Workspace</Button>
                </CreateWorkspaceDialog>
            </div>
        )
    }

    const projects = await getProjects(currentWorkspace.id, supabase)
    const tasks = await getTasks(currentWorkspace.id, supabase)
    const members = await getWorkspaceMembers(currentWorkspace.id, supabase)

    // Calculate Stats
    const activeProjects = projects.filter(p => p.status === 'active').length
    const pendingTasks = tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length

    // User name
    const userName = user?.email?.split('@')[0] || 'User'

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <DashboardHeader userName={userName} workspaceName={currentWorkspace?.name} />

            {/* Metrics Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    title="Active Projects"
                    value={activeProjects}
                    icon={Layers}
                    delta="+1"
                    deltaType="increase"
                    description="from last week"
                />
                <MetricCard
                    title="Pending Tasks"
                    value={pendingTasks}
                    icon={Inbox}
                    delta="-2"
                    deltaType="decrease"
                    description="due this week"
                />
                <MetricCard
                    title="Decisions Logged"
                    value="0"
                    icon={Gavel}
                    description="total in system"
                />
                <MetricCard
                    title="Insights Generated"
                    value="0"
                    icon={Lightbulb}
                    delta="+0"
                    deltaType="neutral"
                    description="new findings"
                />
            </div>

            {/* Main Content Split */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column: Projects (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-semibold tracking-tight text-foreground/90">Active Projects</h3>
                        <Link href="/dashboard/projects" className="text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors">View All</Link>
                    </div>
                    {projects.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {projects.slice(0, 4).map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="border border-dashed rounded-lg p-8 text-center text-muted-foreground">
                            No active projects.
                        </div>
                    )}
                </div>

                {/* Right Column: Activity + Team (1/3 width) */}
                <div className="space-y-8">
                    <TeamWidget
                        workspaceId={currentWorkspace.id}
                        workspaceName={currentWorkspace.name}
                        members={members}
                    />

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold tracking-tight text-foreground/90">Activity</h3>
                        </div>
                        <ActivityFeed />
                    </div>
                </div>
            </div>
        </div>
    )
}
