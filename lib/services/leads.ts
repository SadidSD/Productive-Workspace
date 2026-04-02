import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
export type LeadSource = 'website' | 'referral' | 'social' | 'cold_outreach' | 'event' | 'other'

export interface Lead {
    id: string
    workspace_id: string
    name: string
    email?: string | null
    phone?: string | null
    company?: string | null
    status: LeadStatus
    source: LeadSource
    value?: number | null
    notes?: string | null
    tags?: string[] | null
    assigned_to?: string | null
    last_contacted_at?: string | null
    created_at: string
    updated_at: string
}

export async function getLeads(workspaceId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('leads')
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

    return data as Lead[]
}

export async function getLead(leadId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single()

    if (error) {
        console.error('Supabase error:', error)
        return null
    }

    if (!data) {
        return null
    }

    return data as Lead
}

export async function createLead(
    workspaceId: string,
    lead: Pick<Lead, 'name' | 'email' | 'phone' | 'company' | 'status' | 'source' | 'value' | 'notes' | 'assigned_to'>
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('leads')
        .insert({
            workspace_id: workspaceId,
            ...lead
        })
        .select()
        .single()

    if (error) throw error
    return data as Lead
}

export async function updateLead(
    leadId: string,
    updates: Partial<Pick<Lead, 'name' | 'email' | 'phone' | 'company' | 'status' | 'source' | 'value' | 'notes' | 'assigned_to' | 'last_contacted_at'>>
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', leadId)
        .select()
        .single()

    if (error) throw error
    return data as Lead
}

export async function deleteLead(leadId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)

    if (error) throw error
    return true
}
