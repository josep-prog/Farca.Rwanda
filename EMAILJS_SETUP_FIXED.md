# EmailJS Setup Guide - Complete Instructions

## Problem Fixed ✅
Your contact form was getting a **404 "Account not found"** error because the EmailJS Service ID and Template ID were hardcoded but don't exist in any EmailJS account.

## Solution: Use Your Own EmailJS Account

### Step 1: Create EmailJS Account
1. Go to **https://www.emailjs.com/**
2. Click "Sign Up" → Create account with your email
3. Verify your email

### Step 2: Get Your Public Key
1. In EmailJS Dashboard, click **"API Keys"** (left sidebar)
2. Copy your **Public Key**
3. Save it somewhere safe

### Step 3: Create Email Service
1. Go to **"Email Services"** (left sidebar)
2. Click **"Add Service"**
3. Choose your email provider (Gmail recommended):
   - Select "Gmail"
   - Click "Connect Account"
   - Authorize your Gmail account
   - **Service ID will be auto-generated** (e.g., `service_abc123`)
4. Copy the **Service ID**

### Step 4: Create Email Template
1. Go to **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. Use this template:
   ```
   Subject: New Contact Form Submission from BuildMart
   
   From: {{from_name}} ({{from_email}})
   Phone: {{phone}}
   
   Message:
   {{message}}
   
   ---
   Reply-to: {{reply_to}}
   ```
4. Copy the **Template ID** (e.g., `template_xyz789`)

### Step 5: Update .env.local File
Edit `.env.local` in your project root and fill in:

```env
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VITE_EMAILJS_SERVICE_ID=YOUR_SERVICE_ID_HERE
VITE_EMAILJS_TEMPLATE_ID=YOUR_TEMPLATE_ID_HERE
```

**Example (filled in):**
```env
VITE_EMAILJS_PUBLIC_KEY=abc123xyz456...
VITE_EMAILJS_SERVICE_ID=service_a1b2c3d4e5f6g7
VITE_EMAILJS_TEMPLATE_ID=template_z9y8x7w6v5u4t3
```

### Step 6: Restart Development Server
1. Stop your dev server (Ctrl+C)
2. Run: `npm run dev` or `bun run dev`
3. Go to `/contact` and test the form

## How It Works Now
```
User fills contact form
    ↓
Form submits to EmailJS
    ↓
EmailJS uses your credentials from .env.local
    ↓
Email sent to buildmart645@gmail.com
    ↓
You receive the message!
```

## Verify It's Working
After setup, test by:
1. Going to `http://localhost:5173/contact`
2. Filling the form completely
3. Clicking "Send Message"
4. Check buildmart645@gmail.com inbox (may be in spam)

## Troubleshooting

### Still getting 404 error
- Check `.env.local` has correct values
- Restart dev server
- Service ID format is usually `service_xxxxx`
- Template ID format is usually `template_xxxxx`

### Emails not arriving
- Check EmailJS quotas (free tier has limits)
- Check spam folder
- Verify Service and Template IDs are correct

### "Environment variable not configured" warning
- Make sure `.env.local` file exists in project root
- Make sure it has all 3 variables
- Restart dev server

## Security Notes
✅ `.env.local` is in `.gitignore` (not committed)
✅ Public Key is public (safe to expose)
✅ Service/Template IDs are internal (not sensitive)

## Need More Help?
- EmailJS Docs: https://www.emailjs.com/docs/
- Contact: buildmart645@gmail.com or +250 791 646 062 (WhatsApp)

---

**Last Updated**: January 1, 2026
