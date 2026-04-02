"use client"

import { useState, useEffect, useMemo } from "react"
import { Lead, LeadStatus, LeadSource, updateLead, deleteLead } from "@/lib/services/leads"
import { getWorkspaceMembers, WorkspaceMember } from "@/lib/services/members"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    MoreVertical,
    Edit2,
    Trash2,
    Loader2,
    Search,
    UserCircle2,
    Building2,
    Mail,
    Phone,
    DollarSign,
    ArrowUpDown,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface LeadListProps {
    initialLeads: Lead[]
    workspaceId: string
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
    new: { label: "New", className: "bg-sky-100 text-sky-700" },
    contacted: { label: "Contacted", className: "bg-blue-100 text-blue-700" },
    qualified: { label: "Qualified", className: "bg-indigo-100 text-indigo-700" },
    proposal: { label: "Proposal", className: "bg-purple-100 text-purple-700" },
    negotiation: { label: "Negotiation", className: "bg-amber-100 text-amber-700" },
    won: { label: "Won", className: "bg-emerald-100 text-emerald-700" },
    lost: { label: "Lost", className: "bg-red-100 text-red-700" },
}

const sourceLabels: Record<LeadSource, string> = {
    website: "Website",
    referral: "Referral",
    social: "Social",
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

type FilterStatus = LeadStatus | 'all'

export function LeadList({ initialLeads, workspaceId }: LeadListProps) {
    const [leads, setLeads] = useState<Lead[]>(initialLeads)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
    const [sortField, setSortField] = useState<'created_at' | 'value' | 'name'>('created_at')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

    // Edit Dialog State
    const [editLead, setEditLead] = useState<Lead | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [members, setMembers] = useState<WorkspaceMember[]>([])

    // Delete State
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    useEffect(() => {
        setLeads(initialLeads)
    }, [initialLeads])

    useEffect(() => {
        if (editLead) {
            getWorkspaceMembers(workspaceId).then(setMembers)
        }
    }, [editLead, workspaceId])

    // Filtered & sorted leads
    const filteredLeads = useMemo(() => {
        let result = [...leads]

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(l =>
                l.name.toLowerCase().includes(q) ||
                l.company?.toLowerCase().includes(q) ||
                l.email?.toLowerCase().includes(q)
            )
        }

        // Status filter
        if (filterStatus !== 'all') {
            result = result.filter(l => l.status === filterStatus)
        }

        // Sort
        result.sort((a, b) => {
            let comparison = 0
            if (sortField === 'name') {
                comparison = a.name.localeCompare(b.name)
            } else if (sortField === 'value') {
                comparison = (a.value || 0) - (b.value || 0)
            } else {
                comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            }
            return sortDirection === 'asc' ? comparison : -comparison
        })

        return result
    }, [leads, searchQuery, filterStatus, sortField, sortDirection])

    // Pipeline stats
    const pipelineStats = useMemo(() => {
        const active = leads.filter(l => !['won', 'lost'].includes(l.status))
        const totalValue = active.reduce((sum, l) => sum + (l.value || 0), 0)
        const wonValue = leads.filter(l => l.status === 'won').reduce((sum, l) => sum + (l.value || 0), 0)
        return { activeCount: active.length, totalValue, wonValue, totalCount: leads.length }
    }, [leads])

    const handleDelete = async (leadId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm("Are you sure you want to delete this lead?")) return

        setIsDeleting(leadId)
        try {
            await deleteLead(leadId)
            setLeads(leads.filter(l => l.id !== leadId))
        } catch (error) {
            console.error("Failed to delete lead:", error)
        } finally {
            setIsDeleting(null)
        }
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editLead) return

        setIsEditing(true)
        try {
            const updates = {
                name: editLead.name,
                email: editLead.email,
                phone: editLead.phone,
                company: editLead.company,
                status: editLead.status,
                source: editLead.source,
                value: editLead.value,
                notes: editLead.notes,
                assigned_to: editLead.assigned_to === 'unassigned' ? null : editLead.assigned_to,
            }

            const updatedLead = await updateLead(editLead.id, updates)
            setLeads(leads.map(l => l.id === editLead.id ? updatedLead : l))
            setEditLead(null)
        } catch (error) {
            console.error("Failed to update lead:", error)
        } finally {
            setIsEditing(false)
        }
    }

    const handleQuickStatusChange = async (leadId: string, newStatus: LeadStatus) => {
        // Optimistic update
        setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
        try {
            await updateLead(leadId, { status: newStatus })
        } catch (error) {
            console.error("Failed to update status:", error)
            setLeads(leads.map(l => l.id === leadId ? { ...l, status: leads.find(ol => ol.id === leadId)!.status } : l))
        }
    }

    const toggleSort = (field: 'created_at' | 'value' | 'name') => {
        if (sortField === field) {
            setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortDirection('desc')
        }
    }

    const statusTabs: { value: FilterStatus; label: string; count: number }[] = [
        { value: 'all', label: 'All', count: leads.length },
        { value: 'new', label: 'New', count: leads.filter(l => l.status === 'new').length },
        { value: 'contacted', label: 'Contacted', count: leads.filter(l => l.status === 'contacted').length },
        { value: 'qualified', label: 'Qualified', count: leads.filter(l => l.status === 'qualified').length },
        { value: 'proposal', label: 'Proposal', count: leads.filter(l => l.status === 'proposal').length },
        { value: 'negotiation', label: 'Negotiation', count: leads.filter(l => l.status === 'negotiation').length },
        { value: 'won', label: 'Won', count: leads.filter(l => l.status === 'won').length },
        { value: 'lost', label: 'Lost', count: leads.filter(l => l.status === 'lost').length },
    ]

    return (
        <div className="space-y-6">
            {/* Pipeline Summary Cards */}
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Total Leads</p>
                    <p className="text-2xl font-bold tracking-tight">{pipelineStats.totalCount}</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Active Pipeline</p>
                    <p className="text-2xl font-bold tracking-tight">{pipelineStats.activeCount}</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Pipeline Value</p>
                    <p className="text-2xl font-bold tracking-tight">{formatCurrency(pipelineStats.totalValue)}</p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Won Value</p>
                    <p className="text-2xl font-bold tracking-tight text-emerald-600">{formatCurrency(pipelineStats.wonValue)}</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="space-y-4">
                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1">
                    {statusTabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setFilterStatus(tab.value)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                filterStatus === tab.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1.5 text-xs ${
                                    filterStatus === tab.value ? 'opacity-80' : 'opacity-60'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {filteredLeads.length > 0 ? (
                <div className="rounded-lg border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                        Name
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </button>
                                </TableHead>
                                <TableHead>Company</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>
                                    <button onClick={() => toggleSort('value')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                        Value
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </button>
                                </TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>
                                    <button onClick={() => toggleSort('created_at')} className="flex items-center gap-1 hover:text-foreground transition-colors">
                                        Added
                                        <ArrowUpDown className="h-3.5 w-3.5" />
                                    </button>
                                </TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLeads.map(lead => {
                                const status = statusConfig[lead.status]
                                return (
                                    <TableRow key={lead.id} className="group">
                                        <TableCell className="font-medium">
                                            <div className="flex flex-col">
                                                <span>{lead.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {lead.company && (
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <Building2 className="h-3.5 w-3.5" />
                                                    <span>{lead.company}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button>
                                                        <Badge variant="outline" className={`cursor-pointer ${status.className}`}>
                                                            {status.label}
                                                        </Badge>
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    {(Object.keys(statusConfig) as LeadStatus[]).map(s => (
                                                        <DropdownMenuItem
                                                            key={s}
                                                            onClick={() => handleQuickStatusChange(lead.id, s)}
                                                            className={lead.status === s ? 'bg-muted' : ''}
                                                        >
                                                            <Badge variant="outline" className={`mr-2 ${statusConfig[s].className}`}>
                                                                {statusConfig[s].label}
                                                            </Badge>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {sourceLabels[lead.source]}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {lead.value ? (
                                                <span className="font-medium">{formatCurrency(lead.value)}</span>
                                            ) : (
                                                <span className="text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {lead.email && (
                                                    <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground transition-colors">
                                                        <Mail className="h-4 w-4" />
                                                    </a>
                                                )}
                                                {lead.phone && (
                                                    <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground transition-colors">
                                                        <Phone className="h-4 w-4" />
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm text-muted-foreground">
                                                {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {isDeleting === lead.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreVertical className="h-4 w-4" />}
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => setEditLead({ ...lead, assigned_to: lead.assigned_to || 'unassigned' })}>
                                                        <Edit2 className="mr-2 h-4 w-4" />
                                                        Edit Lead
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10 cursor-pointer" onClick={(e) => handleDelete(lead.id, e)}>
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete Lead
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center p-12 border border-dashed rounded-lg text-muted-foreground">
                    {searchQuery || filterStatus !== 'all'
                        ? "No leads match your filters."
                        : "No leads yet. Add your first lead above!"}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editLead} onOpenChange={(open) => !open && setEditLead(null)}>
                <DialogContent className="sm:max-w-[560px]">
                    <DialogHeader>
                        <DialogTitle>Edit Lead</DialogTitle>
                        <DialogDescription>Update the details of your lead.</DialogDescription>
                    </DialogHeader>
                    {editLead && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 py-4">
                            {/* Name + Company */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Name</Label>
                                    <Input
                                        id="edit-name"
                                        value={editLead.name}
                                        onChange={(e) => setEditLead({ ...editLead, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-company">Company</Label>
                                    <Input
                                        id="edit-company"
                                        value={editLead.company || ''}
                                        onChange={(e) => setEditLead({ ...editLead, company: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Email + Phone */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-email">Email</Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={editLead.email || ''}
                                        onChange={(e) => setEditLead({ ...editLead, email: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-phone">Phone</Label>
                                    <Input
                                        id="edit-phone"
                                        type="tel"
                                        value={editLead.phone || ''}
                                        onChange={(e) => setEditLead({ ...editLead, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Status + Source */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-status">Status</Label>
                                    <Select
                                        value={editLead.status}
                                        onValueChange={(value: LeadStatus) => setEditLead({ ...editLead, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="contacted">Contacted</SelectItem>
                                            <SelectItem value="qualified">Qualified</SelectItem>
                                            <SelectItem value="proposal">Proposal</SelectItem>
                                            <SelectItem value="negotiation">Negotiation</SelectItem>
                                            <SelectItem value="won">Won</SelectItem>
                                            <SelectItem value="lost">Lost</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-source">Source</Label>
                                    <Select
                                        value={editLead.source}
                                        onValueChange={(value: LeadSource) => setEditLead({ ...editLead, source: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="website">Website</SelectItem>
                                            <SelectItem value="referral">Referral</SelectItem>
                                            <SelectItem value="social">Social Media</SelectItem>
                                            <SelectItem value="cold_outreach">Cold Outreach</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Value + Assignee */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-value">Deal Value ($)</Label>
                                    <Input
                                        id="edit-value"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editLead.value || ''}
                                        onChange={(e) => setEditLead({ ...editLead, value: e.target.value ? parseFloat(e.target.value) : null })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-assignee">Assigned To</Label>
                                    <Select
                                        value={editLead.assigned_to || 'unassigned'}
                                        onValueChange={(value) => setEditLead({ ...editLead, assigned_to: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unassigned" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                            {members.map(member => (
                                                <SelectItem key={member.user_id} value={member.user_id}>
                                                    <div className="flex items-center gap-2">
                                                        <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                                                        <span>{member.user?.full_name || member.user?.email || 'Unknown'}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Notes */}
                            <div className="grid gap-2">
                                <Label htmlFor="edit-notes">Notes</Label>
                                <Textarea
                                    id="edit-notes"
                                    value={editLead.notes || ''}
                                    onChange={(e) => setEditLead({ ...editLead, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={isEditing}>
                                    {isEditing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
