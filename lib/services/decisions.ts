import { createClient } from '@/lib/supabase/client'

export interface Decision {
    id: string
    workspace_id: string
    title: string
    status: 'proposed' | 'approved' | 'reversed'
    rationale?: string
    created_at: string
}

export async function getDecisions(workspaceId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

    if (error) {
        console.warn('Supabase error (using mock data):', error)
        return MOCK_DECISIONS
    }

    if (!data || data.length === 0) {
        if (workspaceId === 'demo-ws') return MOCK_DECISIONS
        return []
    }

    return data as Decision[]
}

const MOCK_DECISIONS: Decision[] = [
    {
        id: '1',
        workspace_id: 'demo-ws',
        title: 'Switch to Next.js App Router',
        status: 'approved',
        rationale: 'Better performance and server components support.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
    {
        id: '2',
        workspace_id: 'demo-ws',
        title: 'Use Tailwind CSS for Styling',
        status: 'approved',
        rationale: 'Utility-first approach speeds up development.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
    }
]
