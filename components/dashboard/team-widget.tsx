"use client"

import { useState } from "react"
import type { WorkspaceMember } from "@/lib/services/workspaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Mail, Plus, MoreHorizontal, Settings, Copy, Check, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { createInvite } from "@/lib/services/invites"

interface TeamWidgetProps {
    workspaceId: string
    workspaceName: string
    members: WorkspaceMember[]
}

export function TeamWidget({ workspaceId, workspaceName, members }: TeamWidgetProps) {
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteLink, setInviteLink] = useState("")
    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<'input' | 'success'>('input')

    const handleCreateInvite = async () => {
        setIsLoading(true)
        try {
            const invite = await createInvite(workspaceId, inviteEmail)

            // Construct Link
            const link = `${window.location.origin}/join/${invite.token}`
            setInviteLink(link)
            setStep('success')
        } catch (error) {
            console.error("Invite failed", error)
        } finally {
            setIsLoading(false)
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
    }

    const reset = () => {
        setStep('input')
        setInviteEmail("")
        setIsInviteOpen(false)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">Team & Access</CardTitle>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/settings/members">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <Settings className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="space-y-3">
                    {members.slice(0, 5).map(member => (
                        <div key={member.user_id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 border">
                                    <AvatarImage src={member.profile.avatar_url} />
                                    <AvatarFallback>{member.profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-medium leading-none">
                                        {member.profile.full_name || 'Team Member'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {member.profile.email}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                    {members.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                            + {members.length - 5} more members
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full gap-2" variant="outline">
                                <Plus className="h-4 w-4" />
                                Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite to {workspaceName}</DialogTitle>
                                <DialogDescription>
                                    Generate a unique link for your team member.
                                </DialogDescription>
                            </DialogHeader>

                            {step === 'input' ? (
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address (Optional)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="colleague@company.com"
                                                className="pl-9"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleCreateInvite} disabled={isLoading}>
                                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Generate Invite Link
                                        </Button>
                                    </DialogFooter>
                                </div>
                            ) : (
                                <div className="grid gap-4 py-4 animate-in fade-in zoom-in-95">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-green-600 flex items-center gap-2">
                                            <Check className="w-4 h-4" /> Link Generated!
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <Input value={inviteLink} readOnly className="font-mono text-xs bg-muted" />
                                            <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Share this link. It will expire in 7 days.
                                        </p>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="secondary" onClick={reset}>Close</Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    )
}
