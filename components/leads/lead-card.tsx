"use client"

import { Lead, LeadStatus } from "@/lib/services/leads"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Mail, Phone, DollarSign, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface LeadCardProps {
    lead: Lead
    onClick?: () => void
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
    new: { label: "New", className: "bg-sky-100 text-sky-700 border-sky-200" },
    contacted: { label: "Contacted", className: "bg-blue-100 text-blue-700 border-blue-200" },
    qualified: { label: "Qualified", className: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    proposal: { label: "Proposal", className: "bg-purple-100 text-purple-700 border-purple-200" },
    negotiation: { label: "Negotiation", className: "bg-amber-100 text-amber-700 border-amber-200" },
    won: { label: "Won", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    lost: { label: "Lost", className: "bg-red-100 text-red-700 border-red-200" },
}

function formatSource(source: string): string {
    return source
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
    const status = statusConfig[lead.status]

    return (
        <Card
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 hover:bg-muted/30 group"
            onClick={onClick}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                            {lead.name}
                        </h4>
                        {lead.company && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{lead.company}</span>
                            </div>
                        )}
                    </div>
                    <Badge variant="outline" className={`ml-2 flex-shrink-0 ${status.className}`}>
                        {status.label}
                    </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                        {lead.email && (
                            <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[120px]">{lead.email}</span>
                            </div>
                        )}
                        {lead.phone && (
                            <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phone}</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {lead.value && (
                            <div className="flex items-center gap-1 font-medium text-foreground">
                                <DollarSign className="h-3 w-3" />
                                <span>{formatCurrency(lead.value)}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</span>
                        </div>
                    </div>
                </div>

                {lead.source && lead.source !== 'other' && (
                    <div className="mt-2 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                            via {formatSource(lead.source)}
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
