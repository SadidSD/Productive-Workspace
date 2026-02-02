import { getResearchById } from "@/lib/services/research"
import { ResearchShell } from "@/components/research/research-shell"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

interface PageProps {
    params: Promise<{ id: string }>
}

export default async function ResearchDetailPage({ params }: PageProps) {
    const { id } = await params
    const supabase = await createClient()
    const inquiry = await getResearchById(id, supabase)

    if (!inquiry) return notFound()

    return <ResearchShell initialInquiry={inquiry} />
}
