"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserPlus, Mail, Shield } from "lucide-react"
import { toast } from "sonner"
import { inviteMember, getWorkspaceMembers, WorkspaceMember } from "@/lib/services/members"

// Mock data for initial dev
const MOCK_MEMBERS = [
    { user_id: '1', role: 'owner', joined_at: new Date().toISOString(), user: { email: 'you@agency.com', full_name: 'You' } },
    { user_id: '2', role: 'editor', joined_at: new Date().toISOString(), user: { email: 'sarah@agency.com', full_name: 'Sarah Design' } },
]

export default function MembersPage() {
    const [members, setMembers] = useState<any[]>(MOCK_MEMBERS) // Use appropriate type
    const [isLoading, setIsLoading] = useState(false)
    const [inviteOpen, setInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState("editor")
    const [isInviting, setIsInviting] = useState(false)

    // In a real app, fetch members on mount
    /*
    useEffect(() => {
        getWorkspaceMembers('current-id').then(setMembers)
    }, [])
    */

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsInviting(true)
        try {
            await inviteMember('current-id', inviteEmail, inviteRole)
            toast.success(`Invitation sent to ${inviteEmail}`)
            setInviteOpen(false)
            setInviteEmail("")
            // Optimistically add to list (mock)
            setMembers(prev => [...prev, {
                user_id: `temp-${Date.now()}`,
                role: inviteRole,
                joined_at: new Date().toISOString(),
                user: { email: inviteEmail, full_name: 'Pending...' }
            }])
        } catch (error) {
            toast.error("Failed to send invitation")
        } finally {
            setIsInviting(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">Team Members</h2>
                    <p className="text-muted-foreground mt-1">Manage who has access to this workspace.</p>
                </div>
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <UserPlus className="mr-2 h-4 w-4" /> Invite Member
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Invite to Workspace</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleInvite} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="colleague@agency.com"
                                        className="pl-9"
                                        type="email"
                                        required
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Role</label>
                                <Select value={inviteRole} onValueChange={setInviteRole}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="editor">Editor</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground">
                                    Admins can manage settings. Editors can create and edit content. Viewers can only read.
                                </p>
                            </div>
                            <Button type="submit" className="w-full" disabled={isInviting}>
                                {isInviting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Invitation
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-lg bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="w-[300px]">User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.user_id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                            {member.user?.full_name?.[0] || member.user?.email?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{member.user?.full_name || 'Unknown'}</div>
                                            <div className="text-xs text-muted-foreground">{member.user?.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {member.role === 'owner' && <Shield className="h-3 w-3 text-amber-500" />}
                                        <Badge variant="outline" className="capitalize font-normal text-muted-foreground">
                                            {member.role}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(member.joined_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" disabled={member.role === 'owner'}>
                                        Manage
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
