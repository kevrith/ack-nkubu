import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const { recipients, subject, template, data } = await req.json()

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(JSON.stringify({ error: 'No recipients provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Fetch email addresses for the recipient profile IDs
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .in('id', recipients)
      .eq('is_active', true)

    if (profilesError) throw profilesError

    // Get emails from auth.users via admin API
    const emails: string[] = []
    for (const profile of profiles || []) {
      const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
      if (authUser?.user?.email) {
        emails.push(authUser.user.email)
      }
    }

    if (emails.length === 0) {
      return new Response(JSON.stringify({ sent: 0, message: 'No valid email addresses found' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Generate email body based on template
    let body = ''
    if (template === 'event_notification' && data) {
      const eventDate = new Date(data.start_datetime).toLocaleDateString('en-KE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Nairobi',
      })
      body = `
        <h2>${data.title}</h2>
        <p>${data.description || ''}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
        <p>Visit the ACK Parish app to RSVP and learn more.</p>
      `
    } else {
      body = `<p>${subject}</p>`
    }

    // Send via Resend (batch, BCC for privacy)
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ACK Parish <noreply@ackparish.org>',
        to: ['noreply@ackparish.org'],
        bcc: emails,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #1a3a5c; color: white; padding: 20px; text-align: center;">
              <h1>ACK Parish Church</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <div style="background-color: white; padding: 20px; border-radius: 8px;">
                ${body}
              </div>
            </div>
            <div style="background-color: #1a3a5c; color: white; padding: 10px; text-align: center; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} ACK Parish Church. All rights reserved.</p>
            </div>
          </div>
        `,
      }),
    })

    const result = await res.json()

    return new Response(JSON.stringify({ sent: emails.length, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
