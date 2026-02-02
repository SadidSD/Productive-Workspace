import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { acceptInvite, getInviteByToken } from "@/lib/services/invites"
import { createClient } from "@/lib/supabase/server"
import { Check, ArrowRight, Ban, Building2 } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

interface JoinPageProps {
    params: Promise<{
        token: string
    }>
}

export default async function JoinPage({ params }: JoinPageProps) {
    const { token } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // 1. Fetch Invite Details
    const invite = await getInviteByToken(token)

    // 2. Handle Invalid/Expired
    if (!invite) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-stone-50">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <Ban className="w-6 h-6 text-red-600" />
                        </div>
                        <CardTitle className="text-xl">Invalid or Expired Link</CardTitle>
                        <CardDescription>
                            This invitation link is no longer valid. Please ask the workspace owner for a new one.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Link href="/dashboard">
                            <Button variant="outline">Go to Dashboard</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // 3. Handle Already Member (Optimization)
    // (Optional: Check if user is already a member to show a "You're already in" message)

    return (
        <div className="flex items-center justify-center min-h-screen bg-stone-50 p-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">You've been invited!</CardTitle>
                    <CardDescription>
                        Join <strong>{invite.workspaces?.name || "the workspace"}</strong> on Kortex to start collaborating.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-muted rounded-md text-sm text-center">
                        <p className="text-muted-foreground">Invited as <span className="font-medium text-foreground capitalize">{invite.role}</span></p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {user ? (
                        <form action={async () => {
                            "use server"
                            const supabase = await createClient()
                            await acceptInvite(token, supabase)
                            redirect(`/dashboard`)
                        }}>
                            <Button size="lg" className="w-full gap-2">
                                Accept Invitation <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-3 w-full">
                            <p className="text-xs text-center text-muted-foreground">You need to log in first.</p>
                            <Link href={`/login?next=/join/${token}`}>
                                <Button size="lg" className="w-full" variant="secondary">Log In to Accept</Button>
                            </Link>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
