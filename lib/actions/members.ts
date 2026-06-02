'use server'

import { createClient } from '@/lib/supabase/server'

export async function removeMember(workspaceId: string, userId: string): Promise<{ success: true } | { success: false; error: string }> {
    const supabase = await createClient()

    const { error } = await supabase.rpc('remove_workspace_member', {
        ws_id: workspaceId,
        target_user_id: userId,
    })

    if (error) return { success: false, error: error.message }
    return { success: true }
}
