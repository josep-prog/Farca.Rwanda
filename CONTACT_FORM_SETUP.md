# Contact Form Email Setup Guide

## Overview
The contact form on your BuildMart website now sends emails directly to `buildmart645@gmail.com` using EmailJS service.

## Setup Instructions

### 1. Install Dependencies
Run this command to install the emailjs-com package:
```bash
npm install emailjs-com
# or
bun install emailjs-com
```

### 2. EmailJS Configuration
The contact form is already configured with:
- **Service ID**: `service_buildmart`
- **Template ID**: `template_contact`
- **Public Key**: `rlTYFsXvOZqqQOlOX`

### 3. Create EmailJS Account & Setup
1. Go to https://www.emailjs.com
2. Sign up with your email (buildmart645@gmail.com recommended)
3. Create an Email Service:
   - **Service ID**: `service_buildmart`
   - Connect Gmail or your preferred email service
4. Create an Email Template:
   - **Template ID**: `template_template_contact`
   - Use this template content:

```html
From: {{from_name}} ({{from_email}})
Phone: {{phone}}

Message:
{{message}}
```

### 4. How It Works
When a user submits the contact form:
1. Their message data is captured
2. EmailJS sends an email to `buildmart645@gmail.com`
3. The email includes:
   - Customer name
   - Customer email
   - Customer phone (if provided)
   - Message
   - Reply-to address set to customer email

### 5. Test the Form
1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to `/contact`
3. Fill out the form and submit
4. Check `buildmart645@gmail.com` for the message

### 6. Features
✅ Real-time email notifications
✅ Contact information preserved in email
✅ Easy reply to customer (reply-to is customer email)
✅ No backend server required
✅ Free tier with generous limits

## Troubleshooting

### "Cannot find module 'emailjs-com'"
- Run: `npm install emailjs-com` or `bun install emailjs-com`

### Emails not sending
- Verify EmailJS Service ID and Template ID are correct
- Check EmailJS dashboard for quota limits
- Verify email credentials in EmailJS dashboard

### Email format looks wrong
- Adjust the template in EmailJS dashboard under "Email Templates"

## Alternative: Manual Email Setup
If you want to use your own email service provider instead:
1. Use SendGrid, Mailgun, or AWS SES
2. Replace the emailjs implementation with their SDK
3. Update the service credentials in Contact.tsx

## Support
For EmailJS help: https://www.emailjs.com/docs
For BuildMart issues: buildmart645@gmail.com
