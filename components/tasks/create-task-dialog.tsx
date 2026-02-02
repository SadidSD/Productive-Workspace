"use client"

import { useState, useEffect } from "react"
import { createTask, Task } from "@/lib/services/tasks"
import { getWorkspaceMembers, WorkspaceMember } from "@/lib/services/members"
import { useRouter } from "next/navigation"
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

interface CreateTaskDialogProps {
    workspaceId: string
    children?: React.ReactNode
}

export function CreateTaskDialog({ workspaceId, children }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [members, setMembers] = useState<WorkspaceMember[]>([])
    const router = useRouter()

    const [formData, setFormData] = useState<{
        title: string
        description: string
        priority: "low" | "medium" | "high"
        assignee_id: string
    }>({
        title: "",
        description: "",
        priority: "medium",
        assignee_id: "unassigned" // Mock string or empty
    })

    useEffect(() => {
        if (open) {
            getWorkspaceMembers(workspaceId).then(setMembers)
        }
    }, [open, workspaceId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createTask(workspaceId, {
                title: formData.title,
                description: formData.description,
                priority: formData.priority,
                status: 'todo',
                assignee_id: formData.assignee_id === 'unassigned' ? undefined : formData.assignee_id
            })
            setOpen(false)
            router.refresh()
            setFormData({ title: "", description: "", priority: "medium", assignee_id: "unassigned" })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Task</DialogTitle>
                    <DialogDescription>
                        Add a new action item to your execution queue.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Write API Documentation"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="assignee">Assignee</Label>
                            <Select
                                value={formData.assignee_id}
                                onValueChange={(value) => setFormData({ ...formData, assignee_id: value })}
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

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Additional details..."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Task
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
