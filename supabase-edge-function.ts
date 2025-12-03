import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContactFormData {
  full_name: string
  email: string
  subject: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const { full_name, email, subject, message }: ContactFormData = await req.json()

    // Validate required fields
    if (!full_name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send email notification using Resend
    const emailData = {
      to: 'support@tradecenfxvip.com', // Your support email
      from: 'TradeCentralFX <noreply@tradecenfxvip.com>', // Your sending email with display name
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background-color: #002A2B; padding: 24px; border-radius: 8px 8px 0 0;">
            <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.96px;">TradeCentralFX Contact Form</h2>
          </div>
          
          <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #000000; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Contact Details</h3>
              <p style="color: #666666; margin: 8px 0; font-size: 14px; line-height: 22.4px;"><strong style="color: #000000;">Name:</strong> ${full_name}</p>
              <p style="color: #666666; margin: 8px 0; font-size: 14px; line-height: 22.4px;"><strong style="color: #000000;">Email:</strong> <a href="mailto:${email}" style="color: #009296; text-decoration: none;">${email}</a></p>
              <p style="color: #666666; margin: 8px 0; font-size: 14px; line-height: 22.4px;"><strong style="color: #000000;">Subject:</strong> ${subject}</p>
              <p style="color: #666666; margin: 8px 0; font-size: 14px; line-height: 22.4px;"><strong style="color: #000000;">Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #000000; margin: 0 0 16px 0; font-size: 16px; font-weight: 600;">Message</h3>
              <p style="color: #000000; margin: 0; white-space: pre-wrap; line-height: 22.4px; font-size: 14px; font-weight: 400;">${message}</p>
            </div>
            
            <div style="padding: 16px; background-color: #f8f9fa; border-radius: 8px; border-left: 3px solid #009296;">
              <p style="margin: 0; color: #000000; font-size: 14px; font-weight: 500;">
                <strong>Reply to:</strong> <a href="mailto:${email}" style="color: #009296; text-decoration: none; font-weight: 500;">${email}</a>
              </p>
            </div>
          </div>
        </div>
      `,
    }

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Email sending failed:', errorText)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contact message sent successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing contact form:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
