import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export interface Task {
    id: string
    workspace_id: string
    project_id?: string | null
    title: string
    description?: string | null
    status: 'todo' | 'in_progress' | 'review' | 'done'
    priority: 'low' | 'medium' | 'high'
    assignee_id?: string | null
    due_date?: string | null
    created_at: string
}

export async function getTasks(workspaceId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('tasks')
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

    return data as Task[]
}

export async function getTasksByProject(projectId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('priority', { ascending: false }) // High priority first

    if (error) {
        console.error('Supabase error:', error)
        return []
    }

    if (!data || data.length === 0) {
        return []
    }

    return data as Task[]
}

export async function createTask(
    workspaceId: string,
    task: Pick<Task, 'title' | 'description' | 'priority' | 'status' | 'assignee_id' | 'due_date'>
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('tasks')
        .insert({
            workspace_id: workspaceId,
            ...task
        })
        .select()
        .single()

    if (error) throw error
    return data as Task
}
