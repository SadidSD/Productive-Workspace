"use client"

import { useState } from "react"
import type { WorkspaceMember } from "@/lib/services/workspaces"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Plus, Settings, Copy, Check, Loader2, Send, UserMinus } from "lucide-react"
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
import { sendInviteEmail } from "@/lib/actions/invite"
import { removeMember } from "@/lib/actions/members"

interface TeamWidgetProps {
    workspaceId: string
    workspaceName: string
    members: WorkspaceMember[]
}

export function TeamWidget({ workspaceId, workspaceName, members: initialMembers }: TeamWidgetProps) {
    const [members, setMembers] = useState(initialMembers)
    const [isInviteOpen, setIsInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteLink, setInviteLink] = useState("")
    const [isCopied, setIsCopied] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<'input' | 'success'>('input')
    const [error, setError] = useState<string | null>(null)
    const [removingUserId, setRemovingUserId] = useState<string | null>(null)

    const handleRemoveMember = async (userId: string) => {
        setRemovingUserId(userId)
        try {
            const result = await removeMember(workspaceId, userId)
            if (result.success) {
                setMembers(prev => prev.filter(m => m.user_id !== userId))
            } else {
                alert(result.error)
            }
        } finally {
            setRemovingUserId(null)
        }
    }

    const handleSendInvite = async () => {
        if (!inviteEmail.trim()) return
        setIsLoading(true)
        setError(null)
        try {
            const result = await sendInviteEmail(workspaceId, workspaceName, inviteEmail.trim())
            if (!result.success) {
                setError(result.error)
                return
            }
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
            setInviteLink(`${appUrl}/join/${result.token}`)
            setStep('success')
        } catch {
            setError('Something went wrong. Please try again.')
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
        setInviteLink("")
        setError(null)
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
                            {member.role !== 'owner' && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                                    disabled={removingUserId === member.user_id}
                                    onClick={() => handleRemoveMember(member.user_id)}
                                    title="Remove member"
                                >
                                    {removingUserId === member.user_id
                                        ? <Loader2 className="h-4 w-4 animate-spin" />
                                        : <UserMinus className="h-4 w-4" />
                                    }
                                </Button>
                            )}
                        </div>
                    ))}
                    {members.length > 5 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                            + {members.length - 5} more members
                        </p>
                    )}
                </div>

                <div className="pt-2">
                    <Dialog open={isInviteOpen} onOpenChange={(open) => { if (!open) reset(); setIsInviteOpen(open) }}>
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
                                    Enter the email address of the person you want to invite. They'll receive a link directly.
                                </DialogDescription>
                            </DialogHeader>

                            {step === 'input' ? (
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="email"
                                                placeholder="colleague@company.com"
                                                className="pl-9"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendInvite()}
                                            />
                                        </div>
                                        {error && (
                                            <p className="text-sm text-red-500">{error}</p>
                                        )}
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={handleSendInvite}
                                            disabled={isLoading || !inviteEmail.trim()}
                                            className="gap-2"
                                        >
                                            {isLoading
                                                ? <Loader2 className="h-4 w-4 animate-spin" />
                                                : <Send className="h-4 w-4" />
                                            }
                                            Send Invite
                                        </Button>
                                    </DialogFooter>
                                </div>
                            ) : (
                                <div className="grid gap-4 py-4 animate-in fade-in zoom-in-95">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <Check className="w-4 h-4" />
                                            <span className="text-sm font-medium">
                                                Invite sent to {inviteEmail}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            You can also copy the link below as a backup.
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Input value={inviteLink} readOnly className="font-mono text-xs bg-muted" />
                                            <Button size="icon" variant="outline" onClick={copyToClipboard}>
                                                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Link expires in 7 days.
                                        </p>
                                    </div>
                                    <DialogFooter className="gap-2">
                                        <Button variant="outline" onClick={() => { setStep('input'); setInviteEmail(""); setInviteLink(""); setError(null) }}>
                                            Invite Another
                                        </Button>
                                        <Button variant="secondary" onClick={reset}>Done</Button>
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
