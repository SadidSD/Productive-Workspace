import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface DashboardHeaderProps {
    userName?: string
    workspaceName?: string
}

export function DashboardHeader({ userName = "User", workspaceName }: DashboardHeaderProps) {
    // Approx time of day greeting
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{greeting}, {userName}.</h1>
                <p className="text-muted-foreground mt-1">
                    {workspaceName ? `You are working in ${workspaceName}.` : "Here is what's happening in your workspace today."}
                </p>
            </div>
            <div className="flex gap-2">
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>
        </div >
    )
}
