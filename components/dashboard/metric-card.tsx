import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface MetricCardProps {
    title: string
    value: string | number
    description?: string
    icon: LucideIcon
    delta?: string
    deltaType?: 'increase' | 'decrease' | 'neutral'
}

export function MetricCard({ title, value, description, icon: Icon, delta, deltaType = 'neutral' }: MetricCardProps) {
    return (
        <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {(description || delta) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        {delta && (
                            <span className={`
                        font-medium 
                        ${deltaType === 'increase' ? 'text-green-500' : ''}
                        ${deltaType === 'decrease' ? 'text-red-500' : ''}
                    `}>
                                {delta}
                            </span>
                        )}
                        <span className="opacity-80">{description}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
