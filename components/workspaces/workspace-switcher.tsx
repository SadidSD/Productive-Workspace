'use client'

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog"
import { Workspace } from "@/lib/services/workspaces"

import { useRouter } from "next/navigation"

export function WorkspaceSwitcher({
    workspaces,
    defaultWorkspaceId
}: {
    workspaces: Workspace[]
    defaultWorkspaceId?: string
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()

    // Find active based on prop or default to first
    const [activeWorkspace, setActiveWorkspace] = React.useState<Workspace | undefined>()

    React.useEffect(() => {
        if (workspaces.length > 0) {
            const match = workspaces.find(w => w.id === defaultWorkspaceId)
            setActiveWorkspace(match || workspaces[0])
        }
    }, [workspaces, defaultWorkspaceId])

    const handleSelect = (workspace: Workspace) => {
        setActiveWorkspace(workspace)
        // Set cookie and refresh
        document.cookie = `workspace_id=${workspace.id}; path=/; max-age=31536000` // 1 year
        router.refresh()
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {activeWorkspace ? activeWorkspace.name.substring(0, 1) : "K"}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeWorkspace ? activeWorkspace.name : "Select Workspace"}
                                </span>
                                <span className="truncate text-xs">
                                    {activeWorkspace ? "Free Plan" : ""}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Workspaces
                        </DropdownMenuLabel>
                        {workspaces.map((workspace) => (
                            <DropdownMenuItem
                                key={workspace.id}
                                onClick={() => handleSelect(workspace)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    {workspace.name.substring(0, 1)}
                                </div>
                                {workspace.name}
                                {activeWorkspace?.id === workspace.id && <Check className="ml-auto" />}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <div className="p-1">
                            <CreateWorkspaceDialog>
                                <button className="flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                                    <Plus className="mr-2 h-4 w-4" />
                                    <div className="font-medium text-muted-foreground">Add workspace</div>
                                </button>
                            </CreateWorkspaceDialog>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

