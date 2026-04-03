"use client"

import { Lead, LeadStatus, LeadSource } from "@/lib/services/leads"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Building2, Mail, Phone, DollarSign, Clock, UserCircle2, Globe, Tag } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ViewLeadDialogProps {
    lead: Lead | null
    open: boolean
    onOpenChange: (open: boolean) => void
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

const sourceLabels: Record<LeadSource, string> = {
    website: "Website",
    referral: "Referral",
    social: "Social Media",
    cold_outreach: "Cold Outreach",
    event: "Event",
    other: "Other",
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

export function ViewLeadDialog({ lead, open, onOpenChange }: ViewLeadDialogProps) {
    if (!lead) return null

    const status = statusConfig[lead.status]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <DialogTitle className="text-2xl font-bold">{lead.name}</DialogTitle>
                        <Badge variant="outline" className={status.className}>
                            {status.label}
                        </Badge>
                    </div>
                    <DialogDescription>
                        Added {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Primary Info */}
                    <div className="grid grid-cols-2 gap-4">
                        {lead.company && (
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</span>
                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span>{lead.company}</span>
                                </div>
                            </div>
                        )}
                        {lead.value && (
                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Deal Value</span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{formatCurrency(lead.value)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</span>
                            {lead.email ? (
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{lead.email}</span>
                                </a>
                            ) : (
                                <span className="text-sm text-muted-foreground italic">No email</span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</span>
                            {lead.phone ? (
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{lead.phone}</span>
                                </a>
                            ) : (
                                <span className="text-sm text-muted-foreground italic">No phone</span>
                            )}
                        </div>
                    </div>

                    {/* Source and Assignment */}
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</span>
                            <div className="flex items-center gap-2 text-sm">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span>{sourceLabels[lead.source]}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned To</span>
                            <div className="flex items-center gap-2 text-sm">
                                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                <span>{lead.assigned_to || 'Unassigned'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                        <div className="border-t pt-4">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2">Notes</span>
                            <div className="bg-muted/50 rounded-lg p-3 text-sm whitespace-pre-wrap">
                                {lead.notes}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="border-t pt-4 flex items-center justify-between text-[11px] text-muted-foreground uppercase tracking-tighter">
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Last Updated: {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}</span>
                        </div>
                        {lead.id && (
                            <span className="opacity-50">ID: {lead.id}</span>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
