"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { Home, Inbox, Search, Settings, FileText, Brain, Layers, ChevronUp, User2, LogOut } from "lucide-react"
import { WorkspaceSwitcher } from "@/components/workspaces/workspace-switcher"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Workspace } from "@/lib/services/workspaces"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const items = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Projects",
        url: "/dashboard/projects",
        icon: Layers,
    },
    {
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: Inbox,
    },
    {
        title: "Research Hub",
        url: "/dashboard/research",
        icon: Search,
    },
    {
        title: "Decisions",
        url: "/dashboard/decisions",
        icon: FileText,
    },
    {
        title: "Insights",
        url: "/dashboard/insights",
        icon: Brain,
    },
    {
        title: "Docs (Preview)",
        url: "/dashboard/docs",
        icon: FileText,
    },
    {
        title: "Settings",
        url: "/dashboard/settings/members",
        icon: Settings,
    },
]

export function AppSidebar({
    defaultWorkspaceId,
    initialWorkspaces = [],
    userEmail
}: {
    defaultWorkspaceId?: string
    initialWorkspaces?: Workspace[]
    userEmail?: string
}) {
    const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces)

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <WorkspaceSwitcher workspaces={workspaces} defaultWorkspaceId={defaultWorkspaceId} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Systems Studio</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 />
                                    <span>{userEmail || "User"}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async () => {
                                    const supabase = createClient()
                                    await supabase.auth.signOut()
                                    window.location.href = '/'
                                }}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
