import { getDecisions } from "@/lib/services/decisions"
import { getWorkspaces } from "@/lib/services/workspaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gavel } from "lucide-react"

export default async function DecisionsPage() {
    const workspaces = await getWorkspaces()
    const currentWorkspace = workspaces[0]
    if (!currentWorkspace) return <div>Loading...</div>

    const decisions = await getDecisions(currentWorkspace.id)

    const statusColors = {
        proposed: "bg-blue-100 text-blue-800",
        approved: "bg-green-100 text-green-800",
        reversed: "bg-red-100 text-red-800",
    }

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">Decisions</h2>
                <p className="text-muted-foreground mt-1">
                    Institutional memory. What we decided and why.
                </p>
            </div>

            <div className="space-y-4">
                {decisions.map(decision => (
                    <Card key={decision.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-muted rounded-full">
                                    <Gavel className="w-5 h-5 text-foreground" />
                                </div>
                                <div>
                                    <div className="font-medium text-lg">{decision.title}</div>
                                    <div className="text-sm text-muted-foreground">{decision.rationale}</div>
                                </div>
                            </div>
                            <Badge variant="outline" className={statusColors[decision.status]}>
                                {decision.status.toUpperCase()}
                            </Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
