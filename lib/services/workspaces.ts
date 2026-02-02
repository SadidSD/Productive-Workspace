import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export interface Workspace {
    id: string
    name: string
    slug: string
    created_at: string
}

export async function getWorkspaces(client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('workspaces')
        .select(`
      id,
      name,
      slug,
      created_at,
      workspace_members!inner(role)
    `)

    if (error) {
        console.error('Supabase error:', error)
        return []
    }

    if (!data || data.length === 0) {
        return []
    }

    return data as unknown as Workspace[]
}

export async function createWorkspace(name: string, slug: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Mock Mode: If no user or explicit demo mode
    if (!user) {
        // Return a mock workspace
        const mockWorkspace: Workspace = {
            id: `mock-ws-${Date.now()}`,
            name,
            slug,
            created_at: new Date().toISOString()
        }
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        return mockWorkspace
    }

    // Use RPC to handle creation + membership in one transaction (bypassing RLS complexity)
    // This calls the 'create_new_workspace' function we defined in SQL.
    const { data, error } = await supabase.rpc('create_new_workspace', {
        name,
        slug
    })

    if (error) throw error

    // RPC returns the workspace JSON object
    return data as Workspace
}

export interface WorkspaceMember {
    user_id: string
    role: string
    profile: {
        email: string
        full_name?: string
        avatar_url?: string
    }
}

export async function getWorkspaceMembers(workspaceId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()

    const { data, error } = await supabase
        .from('workspace_members')
        .select(`
            user_id,
            role,
            profiles:user_id (
                full_name,
                avatar_url
            )
        `)
        .eq('workspace_id', workspaceId)

    if (error) {
        console.error('Error fetching workspace members:', error)
        return []
    }

    // Transform to match interface
    return data.map((item: any) => ({
        user_id: item.user_id,
        role: item.role,
        profile: {
            full_name: item.profiles.full_name,
            avatar_url: item.profiles.avatar_url,
            email: "User" // Fallback since we can't query email from profiles yet
        }
    }))
}
