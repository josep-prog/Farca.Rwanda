# Formspree Setup Guide - Simple & Fast

## What Changed
✅ Removed EmailJS completely  
✅ Replaced with **Formspree** (much simpler!)

## Why Formspree?
- **Zero configuration** - Just sign up and create a form
- **No API keys to manage** - Single Form ID is all you need
- **Free tier is generous** - 50 submissions/month free
- **Email goes directly to you** - No templates needed
- **Spam protection built-in** - ReCAPTCHA support

---

## Setup Instructions (2 Minutes)

### Step 1: Sign Up at Formspree
1. Go to **https://formspree.io/register**
2. Sign up with your email (use `buildmart645@gmail.com` recommended)
3. Verify your email

### Step 2: Create a New Form
1. After login, click **"New Form"** or **"Create"**
2. Give it a name (e.g., "BuildMart Contact")
3. Set redirect email to `buildmart645@gmail.com`
4. Click **"Create Form"**

### Step 3: Copy Your Form ID
1. You'll see a Form ID displayed (looks like: `abc123def456`)
2. Copy this ID

### Step 4: Update .env.local
Edit `.env.local` and replace:
```env
VITE_FORMSPREE_ID=your_form_id_here
```

**Example:**
```env
VITE_FORMSPREE_ID=xyzabc123def456
```

### Step 5: Restart Dev Server
```bash
npm run dev
```

### Step 6: Test the Form
1. Go to `http://localhost:5173/contact`
2. Fill out and submit the form
3. Check `buildmart645@gmail.com` inbox

---

## How It Works Now
```
User submits form
    ↓
Contact.tsx sends to Formspree API
    ↓
Formspree processes submission
    ↓
Email sent to buildmart645@gmail.com
    ↓
Done! 🎉
```

## Advantages Over EmailJS
| Feature | Formspree | EmailJS |
|---------|-----------|---------|
| Setup Time | 2 minutes | 10+ minutes |
| Configuration | 1 value | 3 values |
| Dependencies | None | @emailjs/browser |
| Email Delivery | Direct | Via service |
| Free Tier | 50/month | 200/month |

---

## Troubleshooting

### Form not submitting
- Check that `VITE_FORMSPREE_ID` is in `.env.local`
- Restart dev server after adding the ID
- Check browser console for errors

### Email not arriving
- Check spam folder
- Verify email address in Formspree settings
- Check Formspree dashboard for submission logs

### How to see form submissions
1. Go to Formspree dashboard
2. Click on your form name
3. View all submissions with timestamps

---

## Additional Features (Optional)

### Add Spam Protection
Go to Formspree form settings and enable **reCAPTCHA v3** (free)

### Customize Email Notifications
Go to Formspree → Form Settings → Email Notifications

### View Form Analytics
Formspree dashboard shows:
- Total submissions
- Submission history
- Submission times
- Email delivery status

---

## Need More Help?
- Formspree Docs: https://formspree.io/help
- Contact: buildmart645@gmail.com or +250 791 646 062 (WhatsApp)

---

**Status**: ✅ Fully Migrated to Formspree  
**Last Updated**: January 1, 2026
