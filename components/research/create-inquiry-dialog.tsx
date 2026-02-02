"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createResearch } from "@/lib/services/research"
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
import { Loader2, Plus } from "lucide-react"

interface CreateInquiryDialogProps {
    workspaceId: string
}

export function CreateInquiryDialog({ workspaceId }: CreateInquiryDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCreate = async () => {
        if (!title.trim()) return

        setIsLoading(true)
        try {
            const newInquiry = await createResearch(workspaceId, title)
            setOpen(false)
            router.push(`/dashboard/research/${newInquiry.id}`)
        } catch (error) {
            console.error("Failed to create inquiry:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Inquiry
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Research Inquiry</DialogTitle>
                    <DialogDescription>
                        Start a new investigation. This creates a dedicated lab page.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Competitor Analysis 2024"
                            className="col-span-3"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleCreate()
                            }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleCreate} disabled={!title.trim() || isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Inquiry
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
