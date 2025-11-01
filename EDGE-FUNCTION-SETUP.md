# Supabase Edge Function Setup for Contact Form

## 1. Deploy the Edge Function

### Step 1: Create the Function in Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to **Edge Functions** in the left sidebar
3. Click **Create a new function**
4. Name it: `send-contact-email`
5. Copy the code from `supabase-edge-function.ts` and paste it into the function editor
6. Click **Deploy**

### Step 2: Set Environment Variables
1. In the Edge Functions section, click on your function
2. Go to **Settings** tab
3. Add this environment variable:
   - **Key**: `RESEND_API_KEY`
   - **Value**: Your Resend API key (get it from resend.com)

## 2. Get Your Function URL

After deployment, you'll get a URL like:
```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-contact-email
```

## 3. Update the JavaScript File

Replace `YOUR_SUPABASE_EDGE_FUNCTION_URL` in `src/contact-form-handler.js` with your actual function URL:

```javascript
this.edgeFunctionUrl = 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-contact-email'
```

## 4. Set Up Resend (Email Service)

### Get Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add it to your Supabase edge function environment variables

### Verify Your Domain (Optional)
For better deliverability, verify your domain in Resend dashboard.

## 5. Test the Setup

1. Fill out the contact form on your website
2. Check your email inbox (`support@tradecenfxvip.com`)
3. You should receive a formatted email with the contact form details

## 6. Email Template Features

The email will include:
- Professional HTML formatting
- Contact details in a highlighted box
- Message content in a clean layout
- Reply-to link for easy responses
- Branded styling with your colors (#009296)

## 7. Troubleshooting

### Common Issues
1. **CORS errors**: The function includes proper CORS headers
2. **Email not sending**: Check your Resend API key
3. **Function not found**: Ensure the function is deployed correctly
4. **Invalid email format**: The function validates email format

### Debug Steps
1. Check browser console for JavaScript errors
2. Check Supabase Edge Function logs
3. Verify your Resend API key is correct
4. Test the function directly using curl:

```bash
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-contact-email \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

## 8. Production Considerations

- Monitor function usage and costs
- Set up error monitoring
- Consider rate limiting if needed
- Add spam protection (reCAPTCHA) if necessary
