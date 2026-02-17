import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { to, subject, body, type } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'ACK Parish <noreply@ackparish.org>',
        to: [to],
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
              <p>© ${new Date().getFullYear()} ACK Parish Church. All rights reserved.</p>
            </div>
          </div>
        `,
      }),
    })

    const data = await res.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
