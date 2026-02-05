import { createClient } from '@/lib/supabase/client'

export interface ResearchInsight {
    id: string
    statement: string
    context: string
    evidence_url?: string
    confidence: 'low' | 'medium' | 'high'
}

export interface ResearchInquiry {
    id: string
    workspace_id: string
    title: string
    status: 'exploring' | 'synthesizing' | 'archived'
    tags: string[]
    question: string // The Anchor
    scope: string // The Anchor
    content: Record<string, unknown> // The Lab Body (Tiptap)
    insights: ResearchInsight[]
    created_at: string
}

import { SupabaseClient } from '@supabase/supabase-js'

export async function getResearch(workspaceId: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()
    const { data, error } = await supabase
        .from('research_entries')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching research:', error)
        return []
    }

    return data as ResearchInquiry[]
}

export async function getResearchById(id: string, client?: SupabaseClient) {
    const supabase = client ?? createClient()

    // 1. Try fetching from real DB
    const { data: inquiryData } = await supabase
        .from('research_entries')
        .select('*')
        .eq('id', id)
        .single()

    if (inquiryData) {
        // Fetch valid insights
        const { data: insightsData } = await supabase
            .from('research_insights')
            .select('*')
            .eq('inquiry_id', id)
            .order('created_at', { ascending: false })

        return {
            ...inquiryData,
            insights: insightsData || []
        } as ResearchInquiry
    }

    return null
}

export async function updateResearch(id: string, updates: Partial<ResearchInquiry>) {
    const supabase = createClient()

    // Optimistic update for mock data
    const mockIndex = MOCK_RESEARCH.findIndex(r => r.id === id)
    if (mockIndex !== -1) {
        MOCK_RESEARCH[mockIndex] = { ...MOCK_RESEARCH[mockIndex], ...updates }
    }

    const { error } = await supabase
        .from('research_entries')
        .update(updates)
        .eq('id', id)

    if (error) {
        console.warn('Update failed (using mock):', error)
        return
    }
}

export async function createResearch(workspaceId: string, title: string) {
    const supabase = createClient()

    const newInquiry: ResearchInquiry = {
        id: crypto.randomUUID(),
        workspace_id: workspaceId,
        title,
        status: 'exploring',
        tags: [],
        question: '',
        scope: '',
        content: {},
        insights: [],
        created_at: new Date().toISOString()
    }

    // Optimistic Mock Update
    MOCK_RESEARCH.unshift(newInquiry)

    const { error } = await supabase
        .from('research_entries')
        .insert({
            id: newInquiry.id,
            workspace_id: workspaceId,
            title,
            content: {},
            tags: [],
            created_at: newInquiry.created_at
        })

    if (error) {
        console.warn('Create failed (using mock):', error)
    }

    return newInquiry
}

const MOCK_RESEARCH: ResearchInquiry[] = [
    {
        id: '1',
        workspace_id: 'demo-ws',
        title: 'Competitor Landscape: AI Dev Tools',
        status: 'exploring',
        tags: ['market-analysis', 'ai'],
        question: 'How are established dev tools integrating agentic workflows?',
        scope: 'Focus on VS Code extensions and standalone IDEs. Out of scope: CI/CD pipelines.',
        content: {},
        insights: [
            {
                id: 'i1',
                statement: 'Agents are moving from chat to direct file manipulation.',
                context: 'VS COde Copilot Edits update',
                confidence: 'high',
                evidence_url: 'https://code.visualstudio.com/updates'
            }
        ],
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: '2',
        workspace_id: 'demo-ws',
        title: 'UI Patterns in Calm SaaS',
        status: 'synthesizing',
        tags: ['design', 'ux'],
        question: 'What defines the "Calm" aesthetic in modern B2B tools?',
        scope: 'Linear, Raycast, and minimal productivity tools.',
        content: {},
        insights: [],
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    }
]
