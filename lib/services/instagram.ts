import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

// ── Types ──────────────────────────────────────────────────────────────────────

export type IgPostFormat = 'reel' | 'carousel' | 'story' | 'live'
export type IgPostStatus = 'idea' | 'draft' | 'scripted' | 'shot' | 'editing' | 'ready' | 'scheduled' | 'published' | 'missed'
export type IgContentPillar = 'platform_pain' | 'solution' | 'education' | 'comparison' | 'case_study'
export type IgScriptFormula = 'problem_agitate_solve' | 'before_after_bridge' | 'list' | 'opinion_reasoning'
export type IgFunnelStage = 'awareness' | 'education' | 'trust' | 'conversion'

export interface InstagramPost {
    id: string
    workspace_id: string
    title: string
    caption?: string | null
    format: IgPostFormat
    pillar?: IgContentPillar | null
    script_formula?: IgScriptFormula | null
    funnel_stage?: IgFunnelStage | null
    status: IgPostStatus

    // Script structure (Hook → Retain → Reward)
    hook_text?: string | null
    retain_text?: string | null
    reward_text?: string | null

    // Scripting Studio extended fields
    full_script?: string | null
    broll_notes?: string | null
    text_overlays?: string | null
    audio_cues?: string | null

    // VVA framework
    has_value: boolean
    has_vulnerability: boolean
    has_authority: boolean

    // Metadata
    hashtags?: string[] | null
    scheduled_date?: string | null
    scheduled_time?: string | null
    cta?: string | null
    media_notes?: string | null
    notes?: string | null

    created_by?: string | null
    created_at: string
    updated_at: string
}

export interface EngagementCheck {
    id: string
    workspace_id: string
    check_date: string
    engaged_tcg_content: boolean
    replied_comments_dms: boolean
    dmed_store_owners: boolean
    watched_tcg_reels: boolean
    created_at: string
}

// ── Instagram Posts CRUD ────────────────────────────────────────────────────────

export async function getInstagramPosts(workspaceId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('scheduled_date', { ascending: true, nullsFirst: false })

    if (error) {
        console.error('Error fetching instagram posts:', error)
        return []
    }

    return (data || []) as InstagramPost[]
}

export async function createInstagramPost(
    workspaceId: string,
    post: Partial<Omit<InstagramPost, 'id' | 'workspace_id' | 'created_at' | 'updated_at'>>
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('instagram_posts')
        .insert({
            workspace_id: workspaceId,
            ...post,
        })
        .select()
        .single()

    if (error) throw error
    return data as InstagramPost
}

export async function updateInstagramPost(
    postId: string,
    updates: Partial<Omit<InstagramPost, 'id' | 'workspace_id' | 'created_at'>>
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('instagram_posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', postId)
        .select()
        .single()

    if (error) throw error
    return data as InstagramPost
}

export async function updatePostStatus(postId: string, status: IgPostStatus) {
    return updateInstagramPost(postId, { status })
}

export async function deleteInstagramPost(postId: string) {
    const supabase = createClient()

    const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', postId)

    if (error) throw error
    return true
}

// ── Engagement Checklist CRUD ───────────────────────────────────────────────────

export async function getEngagementChecks(
    workspaceId: string,
    startDate: string,
    endDate: string,
    client?: SupabaseClient
) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('ig_engagement_checklist')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('check_date', startDate)
        .lte('check_date', endDate)
        .order('check_date', { ascending: true })

    if (error) {
        console.error('Error fetching engagement checks:', error)
        return []
    }

    return (data || []) as EngagementCheck[]
}

export async function upsertEngagementCheck(
    workspaceId: string,
    checkDate: string,
    updates: Partial<Pick<EngagementCheck, 'engaged_tcg_content' | 'replied_comments_dms' | 'dmed_store_owners' | 'watched_tcg_reels'>>
) {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('ig_engagement_checklist')
        .upsert(
            {
                workspace_id: workspaceId,
                check_date: checkDate,
                ...updates,
            },
            { onConflict: 'workspace_id,check_date' }
        )
        .select()
        .single()

    if (error) throw error
    return data as EngagementCheck
}
