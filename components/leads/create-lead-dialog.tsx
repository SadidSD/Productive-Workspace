"use client"

import { useState, useEffect } from "react"
import { createLead, Lead, LeadStatus, LeadSource } from "@/lib/services/leads"
import { getWorkspaceMembers, WorkspaceMember } from "@/lib/services/members"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, Plus, UserCircle2 } from "lucide-react"

interface CreateLeadDialogProps {
    workspaceId: string
    children?: React.ReactNode
}

interface FormData {
    name: string
    email: string
    phone: string
    company: string
    status: LeadStatus
    source: LeadSource
    value: string
    notes: string
    assigned_to: string
}

const initialFormData: FormData = {
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "new",
    source: "other",
    value: "",
    notes: "",
    assigned_to: "unassigned",
}

export function CreateLeadDialog({ workspaceId, children }: CreateLeadDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [members, setMembers] = useState<WorkspaceMember[]>([])
    const router = useRouter()

    const [formData, setFormData] = useState<FormData>(initialFormData)

    useEffect(() => {
        if (open) {
            getWorkspaceMembers(workspaceId).then(setMembers)
        }
    }, [open, workspaceId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createLead(workspaceId, {
                name: formData.name,
                email: formData.email || undefined,
                phone: formData.phone || undefined,
                company: formData.company || undefined,
                status: formData.status,
                source: formData.source,
                value: formData.value ? parseFloat(formData.value) : undefined,
                notes: formData.notes || undefined,
                assigned_to: formData.assigned_to === 'unassigned' ? undefined : formData.assigned_to,
            })
            setOpen(false)
            router.refresh()
            setFormData(initialFormData)
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to create lead")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Lead
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
                <DialogHeader>
                    <DialogTitle>Add New Lead</DialogTitle>
                    <DialogDescription>
                        Capture a new lead into your pipeline.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Name + Company */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lead-name">Name *</Label>
                            <Input
                                id="lead-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lead-company">Company</Label>
                            <Input
                                id="lead-company"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="Acme Inc."
                            />
                        </div>
                    </div>

                    {/* Email + Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lead-email">Email</Label>
                            <Input
                                id="lead-email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@acme.com"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lead-phone">Phone</Label>
                            <Input
                                id="lead-phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    {/* Status + Source */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="lead-status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: LeadStatus) => setFormData({ ...formData, status: value })}
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
                            <Label htmlFor="lead-source">Source</Label>
                            <Select
                                value={formData.source}
                                onValueChange={(value: LeadSource) => setFormData({ ...formData, source: value })}
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
                            <Label htmlFor="lead-value">Deal Value ($)</Label>
                            <Input
                                id="lead-value"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lead-assignee">Assigned To</Label>
                            <Select
                                value={formData.assigned_to}
                                onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
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
                        <Label htmlFor="lead-notes">Notes</Label>
                        <Textarea
                            id="lead-notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional context about this lead..."
                            rows={3}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Add Lead
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
