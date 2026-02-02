'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import { useEffect } from 'react'
import {
    Plus, Heading1, Heading2, List, ListOrdered, Quote
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface EditorProps {
    initialContent?: string | Record<string, unknown> | null
    editable?: boolean
    onChange?: (content: Record<string, unknown>) => void
}

export function Editor({ initialContent, editable = true, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Placeholder.configure({
                placeholder: "Press '/' for commands...",
            }),
            Typography,
        ],
        content: initialContent,
        editable,
        editorProps: {
            attributes: {
                class: 'prose prose-lg prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[150px] px-2',
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getJSON())
        },
    })

    useEffect(() => {
        if (editor && initialContent && !editor.isDestroyed) {
            // Only set content if editor is empty to avoid overwriting user input
            // OR if we strictly want hydration. 
            // Ideally we only want this on "first load" but initialContent changes on hydration.
            if (editor.isEmpty) {
                editor.commands.setContent(initialContent as any)
            }
        }
    }, [initialContent, editor])

    if (!editor) {
        return null
    }

    if (!editor) {
        return null
    }

    return (
        <div className="relative w-full group">
            {/* Action Bar (Left Gutter) */}
            <div className="absolute top-1 -left-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Plus className="h-4 w-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                            <Heading1 className="mr-2 h-4 w-4" />
                            Heading 1
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                            <Heading2 className="mr-2 h-4 w-4" />
                            Heading 2
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBulletList().run()}>
                            <List className="mr-2 h-4 w-4" />
                            Bullet List
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                            <ListOrdered className="mr-2 h-4 w-4" />
                            Numbered List
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()}>
                            <Quote className="mr-2 h-4 w-4" />
                            Quote
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Seamless Editor Content */}
            <div className="min-h-[150px] w-full" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} />
            </div>

            {/* Hint Text */}
            {editor.isEmpty && (
                <div className="absolute top-2 right-8 text-xs text-muted-foreground opacity-20 pointer-events-none">
                    Type '/' for commands
                </div>
            )}
        </div>
    )
}
