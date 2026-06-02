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
                <DialogHeader className="pb-4 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold text-foreground leading-none">{lead.name}</DialogTitle>
                        <Badge variant="outline" className={`${status.className} capitalize px-2 py-0.5`}>
                            {status.label}
                        </Badge>
                    </div>
                    <DialogDescription className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Added {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    {/* Primary Info */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Company</span>
                            <div className="flex items-center gap-2.5 text-sm font-medium">
                                <Building2 className="h-4 w-4 text-primary/70" />
                                <span className="truncate">{lead.company || '—'}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Deal Value</span>
                            <div className="flex items-center gap-2.5 text-sm font-bold text-emerald-600">
                                <DollarSign className="h-4 w-4" />
                                <span>{formatCurrency(lead.value ?? 7000)}</span>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Email</span>
                            {lead.email ? (
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-2.5 text-sm text-primary hover:underline font-medium">
                                    <Mail className="h-4 w-4 text-primary/70" />
                                    <span className="truncate">{lead.email}</span>
                                </a>
                            ) : (
                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/60 italic">
                                    <Mail className="h-4 w-4" />
                                    <span>No email</span>
                                </div>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Phone</span>
                            {lead.phone ? (
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-2.5 text-sm text-primary hover:underline font-medium">
                                    <Phone className="h-4 w-4 text-primary/70" />
                                    <span>{lead.phone}</span>
                                </a>
                            ) : (
                                <div className="flex items-center gap-2.5 text-sm text-muted-foreground/60 italic">
                                    <Phone className="h-4 w-4" />
                                    <span>No phone</span>
                                </div>
                            )}
                        </div>

                        {/* Source and Assignment */}
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Source</span>
                            <div className="flex items-center gap-2.5 text-sm font-medium">
                                <Globe className="h-4 w-4 text-primary/70" />
                                <span>{sourceLabels[lead.source]}</span>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Assigned To</span>
                            <div className="flex items-center gap-2.5 text-sm font-medium">
                                <UserCircle2 className="h-4 w-4 text-primary/70" />
                                <span className="truncate max-w-[140px]" title={lead.assigned_to || ''}>
                                    {lead.assigned_to || 'Unassigned'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {lead.notes && (
                        <div className="space-y-2.5 pt-2 border-t">
                            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Notes</span>
                            <div className="bg-muted/30 rounded-xl p-4 text-sm leading-relaxed text-foreground/80 border border-muted-foreground/5 break-all">
                                {lead.notes}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3" />
                        <span>Updated {formatDistanceToNow(new Date(lead.updated_at), { addSuffix: true })}</span>
                    </div>
                    {lead.id && (
                        <span className="font-mono opacity-40">ID: {lead.id.slice(0, 8)}...</span>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
