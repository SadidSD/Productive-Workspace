'use server'

import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail(
    workspaceId: string,
    workspaceName: string,
    email: string,
): Promise<{ success: true; token: string } | { success: false; error: string }> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Not authenticated' }

    const token = crypto.randomUUID()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const joinLink = `${appUrl}/join/${token}`

    const { error: dbError } = await supabase
        .from('workspace_invites')
        .insert({
            workspace_id: workspaceId,
            email,
            token,
            role: 'editor',
            created_by: user.id,
        })

    if (dbError) return { success: false, error: dbError.message }

    const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

    const { error: emailError } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: `You've been invited to ${workspaceName} on Kortex`,
        html: buildInviteEmail({ workspaceName, inviterEmail: user.email ?? '', joinLink }),
    })

    if (emailError) {
        // Roll back the invite row so it can't be used with a broken email
        await supabase.from('workspace_invites').delete().eq('token', token)
        return { success: false, error: emailError.message }
    }

    return { success: true, token }
}

function buildInviteEmail({
    workspaceName,
    inviterEmail,
    joinLink,
}: {
    workspaceName: string
    inviterEmail: string
    joinLink: string
}) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family:sans-serif;background:#f9f9f9;margin:0;padding:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0"
               style="background:#fff;border-radius:8px;padding:40px;border:1px solid #e5e5e5;">
          <tr>
            <td>
              <h2 style="margin:0 0 8px;font-size:22px;color:#111;">You've been invited</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;">
                <strong>${inviterEmail}</strong> has invited you to join
                <strong>${workspaceName}</strong> on Kortex.
              </p>
              <a href="${joinLink}"
                 style="display:inline-block;background:#111;color:#fff;text-decoration:none;
                        padding:12px 24px;border-radius:6px;font-size:15px;font-weight:500;">
                Accept Invitation
              </a>
              <p style="margin:24px 0 0;color:#999;font-size:12px;">
                This link expires in 7 days. If you didn't expect this email, you can ignore it.
              </p>
              <p style="margin:8px 0 0;color:#bbb;font-size:11px;word-break:break-all;">
                ${joinLink}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
