import { getLeads } from "@/lib/services/leads"
import { getWorkspaces } from "@/lib/services/workspaces"
import { CreateLeadDialog } from "@/components/leads/create-lead-dialog"
import { LeadList } from "@/components/leads/lead-list"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export default async function LeadsPage() {
    const supabase = await createClient()
    const cookieStore = await cookies()
    const selectedId = cookieStore.get('workspace_id')?.value

    const workspaces = await getWorkspaces(supabase)
    const currentWorkspace = workspaces.find(w => w.id === selectedId) || workspaces[0]

    if (!currentWorkspace) return <div>Loading...</div>

    const leads = await getLeads(currentWorkspace.id, supabase)

    return (
        <div className="max-w-7xl">
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight">Leads</h2>
                        <p className="text-muted-foreground mt-1">
                            Track and manage your sales pipeline.
                        </p>
                    </div>
                    <CreateLeadDialog workspaceId={currentWorkspace.id} />
                </div>
            </div>

            <LeadList initialLeads={leads} workspaceId={currentWorkspace.id} />
        </div>
    )
}
