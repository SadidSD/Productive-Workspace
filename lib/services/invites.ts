import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export interface WorkspaceInvite {
    id: string
    workspace_id: string
    email?: string
    token: string
    role: 'viewer' | 'editor' | 'admin' | 'owner'
    created_at: string
    expires_at: string
}

export async function createInvite(workspaceId: string, email: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Generate a secure random token
    // In a real app complexity: use crypto.randomBytes(32).toString('hex')
    // For simplicity/demo: UUID is fine
    const token = crypto.randomUUID()

    const { data, error } = await supabase
        .from('workspace_invites')
        .insert({
            workspace_id: workspaceId,
            email,
            token,
            role: 'editor', // Defaulting to editor for now
            created_by: user?.id
        })
        .select()
        .single()

    if (error) throw error
    return data as WorkspaceInvite
}

/**
 * Validates a token and returns the invite details.
 * Used on the /join/[token] page.
 */
export async function getInviteByToken(token: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()

    // Explicitly select to check validity (expiry logic should also happen here)
    const { data, error } = await supabase
        .from('workspace_invites')
        .select('*, workspaces(name)')
        .eq('token', token)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString()) // Must not be expired
        .single()

    if (error) return null
    return data
}

/**
 * Accepts an invite, adding the current user to the workspace
 */
export async function acceptInvite(token: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Must be logged in to accept invite")

    // Call the RPC function (Security Definer)
    const { data: workspace_id, error } = await supabase.rpc('accept_invite_by_token', {
        token_str: token
    })

    if (error) {
        console.error("RPC accept_invite_by_token failed:", error)
        throw error
    }

    return workspace_id as string
}
