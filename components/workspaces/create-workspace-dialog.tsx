'use client'

import { useState } from 'react'
import { createWorkspace } from '@/lib/services/workspaces'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Plus } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export function CreateWorkspaceDialog({ children }: { children: React.ReactNode }) {
    const [name, setName] = useState('')
    const [slug, setSlug] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await createWorkspace(name, slug)
            setIsOpen(false)
            router.refresh()
            setName('')
            setSlug('')
        } catch (error) {
            console.error(error)
            alert('Failed to create workspace')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Workspaces are separate environments for your systems and projects.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            placeholder="Acme Agency"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                // Auto-slug
                                if (!slug) {
                                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                                }
                            }}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            placeholder="acme-agency"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Workspace
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
