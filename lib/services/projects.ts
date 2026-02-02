import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export interface Project {
    id: string
    workspace_id: string
    system_id?: string | null
    name: string
    description?: string | null
    status: 'planning' | 'active' | 'paused' | 'completed'
    start_date?: string | null
    target_date?: string | null
    created_at: string
    content_json?: Record<string, unknown> | null
    updated_at?: string
}

export async function getProjects(workspaceId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Supabase error:', error)
        return []
    }

    if (!data || data.length === 0) {
        return []
    }

    return data as Project[]
}

export async function getProject(projectId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

    if (error) {
        console.error('Supabase error:', error)
        return null
    }

    if (!data) {
        return null
    }

    return data as Project
}


export async function createProject(
    workspaceId: string,
    project: Pick<Project, 'name' | 'description' | 'status' | 'start_date' | 'target_date'>
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('projects')
        .insert({
            workspace_id: workspaceId,
            ...project
        })
        .select()
        .single()

    if (error) throw error
    return data as Project
}

export async function updateProject(
    projectId: string,
    updates: Partial<Project>
) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

    if (error) throw error
    return data as Project
}

