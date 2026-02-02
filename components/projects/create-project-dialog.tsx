"use client"

import { useState } from "react"
import { createProject } from "@/lib/services/projects"
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
import { Loader2 } from "lucide-react"

interface CreateProjectDialogProps {
    workspaceId: string
    children: React.ReactNode
}

export function CreateProjectDialog({ workspaceId, children }: CreateProjectDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState<{
        name: string
        description: string
        status: "planning" | "active" | "paused" | "completed"
    }>({
        name: "",
        description: "",
        status: "planning",
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const newProject = await createProject(workspaceId, {
                name: formData.name,
                description: formData.description,
                status: formData.status,
                start_date: new Date().toISOString(), // Default to now
            })



            setOpen(false)
            router.refresh()
            setFormData({ name: "", description: "", status: "planning" })
        } catch (error) {
            console.error(error)
            alert('Failed to create project')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Projects are time-bound execution containers for your systems.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Q1 Marketing Campaign"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="What is the goal of this project?"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value: "planning" | "active" | "paused" | "completed") => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="planning">Planning</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
