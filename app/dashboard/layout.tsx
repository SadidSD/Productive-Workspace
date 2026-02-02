import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cookies } from 'next/headers'
import { createClient } from "@/lib/supabase/server"
import { getWorkspaces } from "@/lib/services/workspaces"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const workspaces = await getWorkspaces(supabase)

    const cookieStore = await cookies()
    const defaultWorkspaceId = cookieStore.get('workspace_id')?.value

    const { data: { user } } = await supabase.auth.getUser()

    return (
        <SidebarProvider>
            <AppSidebar
                defaultWorkspaceId={defaultWorkspaceId}
                initialWorkspaces={workspaces}
                userEmail={user?.email}
            />
            <main className="w-full flex flex-col p-4 md:p-6 bg-background text-foreground">
                <div className="flex items-center mb-6">
                    <SidebarTrigger className="mr-4" />
                    <h1 className="text-xl font-medium text-foreground tracking-tight">Workspace</h1>
                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}
