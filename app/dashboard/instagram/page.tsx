import { getInstagramPosts, getEngagementChecks } from "@/lib/services/instagram"
import { getWorkspaces } from "@/lib/services/workspaces"
import { InstagramPageClient } from "@/components/instagram/instagram-page-client"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { format, subDays, addDays } from "date-fns"

export default async function InstagramPage() {
    const supabase = await createClient()
    const cookieStore = await cookies()
    const selectedId = cookieStore.get('workspace_id')?.value

    const workspaces = await getWorkspaces(supabase)
    const currentWorkspace = workspaces.find(w => w.id === selectedId) || workspaces[0]

    if (!currentWorkspace) {
        redirect('/dashboard')
    }

    // Date range for engagement checklist (last 7 days to next 7 days)
    const today = new Date()
    const startDate = format(subDays(today, 7), 'yyyy-MM-dd')
    const endDate = format(addDays(today, 7), 'yyyy-MM-dd')

    const posts = await getInstagramPosts(currentWorkspace.id, supabase)
    const engagementChecks = await getEngagementChecks(currentWorkspace.id, startDate, endDate, supabase)

    const { data: { user } } = await supabase.auth.getUser()
    const userName = (user?.user_metadata?.full_name as string) || user?.email?.split('@')[0] || 'Founder'

    return (
        <InstagramPageClient
            workspaceId={currentWorkspace.id}
            posts={posts}
            engagementChecks={engagementChecks}
            userName={userName}
        />
    )
}
