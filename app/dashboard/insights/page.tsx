import { getWorkspaces } from "@/lib/services/workspaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb } from "lucide-react"

// Mock Service Inline
const MOCK_INSIGHTS = [
    {
        id: '1',
        title: 'Clients prefer dark mode in evening',
        confidence: 8,
        workspace_id: 'demo-ws'
    },
    {
        id: '2',
        title: 'Mobile traffic up 40% vs last year',
        confidence: 9,
        workspace_id: 'demo-ws'
    }
]

export default async function InsightsPage() {
    const workspaces = await getWorkspaces()
    if (!workspaces[0]) return <div>Loading...</div>

    // Ideally fetch from service, using inline for speed
    const insights = MOCK_INSIGHTS

    return (
        <div className="max-w-6xl">
            <div className="mb-8">
                <h2 className="text-3xl font-semibold tracking-tight">Insights</h2>
                <p className="text-muted-foreground mt-1">
                    Distilled intelligence from your research.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {insights.map(insight => (
                    <Card key={insight.id} className="cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-yellow-400">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-start gap-2">
                                <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                                {insight.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                Confidence Score: <span className="font-medium text-foreground">{insight.confidence}/10</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
