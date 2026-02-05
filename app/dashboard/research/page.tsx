import { getResearch } from "@/lib/services/research"
import { getWorkspaces } from "@/lib/services/workspaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"
import Link from "next/link"

import { createClient } from "@/lib/supabase/server"

import { cookies } from "next/headers"

import { CreateInquiryDialog } from "@/components/research/create-inquiry-dialog"

export default async function ResearchPage() {
    const supabase = await createClient()
    const cookieStore = await cookies()
    const selectedId = cookieStore.get('workspace_id')?.value

    const workspaces = await getWorkspaces(supabase)
    const currentWorkspace = workspaces.find(w => w.id === selectedId) || workspaces[0]

    if (!currentWorkspace) {
        return (
            <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <p>No workspace found.</p>
                    <p className="text-xs mt-1">Create a workspace to view the Research Hub.</p>
                </div>
            </div>
        )
    }

    const entries = await getResearch(currentWorkspace.id, supabase)

    return (
        <div className="max-w-6xl">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Research Hub</h2>
                    <p className="text-muted-foreground mt-1">
                        Raw inputs, interviews, and data collection.
                    </p>
                </div>
                <div className="flex gap-2">
                    <CreateInquiryDialog workspaceId={currentWorkspace.id} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {entries.map(entry => (
                    <Link key={entry.id} href={`/dashboard/research/${entry.id}`}>
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors h-full">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    {entry.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {entry.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
