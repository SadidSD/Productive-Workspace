"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { ExternalLink, Plus, Image as ImageIcon, Link as LinkIcon, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface InspirationItem {
    id: string
    type: 'image' | 'link'
    content: string // URL or Text
    meta?: string // Caption, Title, Author
    added_at: string
}

interface SectionInspoProps {
    initialItems: InspirationItem[]
    onChange: (items: InspirationItem[]) => void
}

export function SectionInspo({ initialItems, onChange }: SectionInspoProps) {
    const [items, setItems] = useState<InspirationItem[]>(initialItems?.length ? initialItems : [])
    const [isOpen, setIsOpen] = useState(false)

    // Form State
    const [activeTab, setActiveTab] = useState<'image' | 'link'>('image')
    const [content, setContent] = useState("")
    const [meta, setMeta] = useState("")

    const updateItems = (newItems: InspirationItem[]) => {
        setItems(newItems)
        onChange(newItems)
    }

    const addItem = () => {
        if (!content.trim()) return

        const newItem: InspirationItem = {
            id: crypto.randomUUID(),
            type: activeTab,
            content,
            meta,
            added_at: new Date().toISOString()
        }

        updateItems([newItem, ...items]) // Add to beginning
        setIsOpen(false)
        setContent("")
        setMeta("")
    }

    const deleteItem = (id: string) => {
        updateItems(items.filter(i => i.id !== id))
    }

    return (
        <section id="inspo" className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold tracking-tight">6. Inspiration</h2>
                    <p className="text-sm text-muted-foreground">The "Signals". Visual references and examples.</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Plus className="h-4 w-4" /> Add Signal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add to Inspiration Board</DialogTitle>
                        </DialogHeader>

                        <Tabs defaultValue="image" value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="image" className="gap-2"><ImageIcon className="h-4 w-4" /> Image</TabsTrigger>
                                <TabsTrigger value="link" className="gap-2"><LinkIcon className="h-4 w-4" /> Link</TabsTrigger>
                            </TabsList>

                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        {activeTab === 'image' ? 'Image URL' : 'Website URL'}
                                    </label>
                                    <Input
                                        placeholder={activeTab === 'image' ? "https://example.com/image.jpg" : "https://example.com"}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Caption / Note <span className="text-muted-foreground font-normal">(Optional)</span>
                                    </label>
                                    <Input
                                        placeholder="What is this referencing?"
                                        value={meta}
                                        onChange={(e) => setMeta(e.target.value)}
                                    />
                                </div>
                                <Button onClick={addItem} disabled={!content.trim()} className="w-full">
                                    Add Signal
                                </Button>
                            </div>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed rounded-xl bg-muted/5">
                        No signals added yet. Collect your inspiration here.
                    </div>
                )}

                {items.map((item) => (
                    <div key={item.id} className="group relative break-inside-avoid rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all">
                        {/* Delete Button */}
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                        >
                            <X className="h-3 w-3" />
                        </button>

                        {/* Content Rendering */}
                        {item.type === 'image' && (
                            <div className="aspect-square relative bg-muted/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={item.content}
                                    alt={item.meta || 'Inspiration'}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Broken+Image' }}
                                />
                                {item.meta && (
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <p className="text-xs text-white font-medium truncate">{item.meta}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {item.type === 'link' && (
                            <a href={item.content} target="_blank" rel="noopener noreferrer" className="block p-4 space-y-3 h-full flex flex-col justify-between hover:bg-muted/5">
                                <div className="space-y-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <LinkIcon className="h-4 w-4" />
                                    </div>
                                    <p className="text-sm font-medium line-clamp-2 leading-snug break-all text-foreground/90">
                                        {item.meta || item.content}
                                    </p>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground uppercase tracking-wider">
                                    <ExternalLink className="h-3 w-3" />
                                    Visit
                                </div>
                            </a>
                        )}
                    </div>
                ))}
            </div>
            <Separator className="my-8 opacity-50" />
        </section>
    )
}
