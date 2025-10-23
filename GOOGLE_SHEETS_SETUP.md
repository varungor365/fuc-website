# 📊 Google Sheets Waitlist Integration - Setup Guide

## ✅ What's Been Done

Your countdown page is now configured to send emails to Google Sheets! Here's how to complete the setup.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"FASHUN.CO Waitlist"**
4. In the first row, add these column headers:

   | A | B | C | D | E |
   |---|---|---|---|---|
   | Email | Timestamp | Source | User Agent | Referrer |

---

### Step 2: Create Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Check for duplicate email (optional but recommended)
    const emailColumn = sheet.getRange('A:A').getValues();
    const emails = emailColumn.map(row => row[0]).filter(email => email);
    
    if (emails.includes(data.email)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Email already exists'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Add new row with data
    sheet.appendRow([
      data.email,
      data.timestamp || new Date().toISOString(),
      data.source || 'launch_countdown',
      data.userAgent || 'unknown',
      data.referrer || 'direct'
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Email added successfully',
      count: sheet.getLastRow() - 1 // Subtract header row
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Optional: Get count of emails
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const count = sheet.getLastRow() - 1; // Subtract header row
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    count: count
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. **Save** the script (💾 icon or Ctrl+S)
4. Name it: **"Waitlist Handler"**

---

### Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** "FASHUN.CO Waitlist API"
   - **Execute as:** Me (your@email.com)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Authorize** the app (grant permissions)
7. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

---

### Step 4: Add URL to Your Project

1. Create `.env.local` file in `fashun-store` folder (if it doesn't exist)
2. Add this line:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_URL_HERE/exec
```

**Replace with your actual URL from Step 3!**

3. Restart your dev server:

```powershell
cd "g:\fuc website\fashun-store"
# Press Ctrl+C to stop current server
npm run dev
```

---

## ✅ Test It!

1. Go to http://localhost:3000
2. Enter your email in the waitlist form
3. Click "Notify Me at Launch"
4. Check your Google Sheet - the email should appear instantly! ✨

---

## 📊 Your Google Sheet Will Look Like This:

| Email | Timestamp | Source | User Agent | Referrer |
|-------|-----------|--------|------------|----------|
| john@example.com | 2025-10-23T10:30:00Z | launch_countdown | Mozilla/5.0... | direct |
| sarah@example.com | 2025-10-23T11:45:00Z | launch_countdown | Mozilla/5.0... | https://instagram.com |
| mike@example.com | 2025-10-23T14:20:00Z | launch_countdown | Mozilla/5.0... | direct |

---

## 🎯 Features Included

### ✅ Duplicate Prevention
- Checks if email already exists in sheet
- Shows error message to user
- Also checks localStorage as backup

### ✅ Automatic Timestamps
- Records exact time of signup
- Uses ISO format (sortable)
- Shows user timezone

### ✅ Source Tracking
- Tracks where signup came from
- Useful for marketing analytics
- Can add UTM parameters later

### ✅ User Agent & Referrer
- Tracks browser/device info
- Shows referral source (social media, direct, etc.)
- Helps understand your audience

---

## 📈 View Your Data

### In Google Sheets:
- See all emails in real-time
- Sort by timestamp
- Filter by source
- Export to CSV anytime
- Share with team members

### Quick Analytics:
```javascript
// Add this to a new sheet tab for auto-counting:

// Cell A1: Total Signups
=COUNTA(Sheet1!A:A)-1

// Cell A2: Today's Signups
=COUNTIF(Sheet1!B:B,">="&TODAY())

// Cell A3: This Week
=COUNTIF(Sheet1!B:B,">="&TODAY()-7)
```

---

## 🔒 Security Notes

### Your Data is Safe:
- ✅ Only you have access to the sheet
- ✅ Web app URL is secret (don't share publicly)
- ✅ Can revoke access anytime
- ✅ Google's security handles authentication

### Privacy Compliance:
- Only collecting email + metadata
- No personal data without consent
- Can delete data anytime
- GDPR compliant (with proper notices)

---

## 🚨 Troubleshooting

### Issue: Emails not appearing in sheet
**Solution:**
1. Check console for errors (F12 → Console tab)
2. Verify Web App URL in `.env.local`
3. Make sure "Who has access" is set to "Anyone"
4. Check Apps Script logs (View → Logs)

### Issue: "Failed to join waitlist" error
**Solution:**
1. Check if Web App is deployed
2. Verify permissions granted
3. Test the URL directly in browser
4. Check Apps Script execution log

### Issue: Duplicate emails getting through
**Solution:**
- The script checks for duplicates
- If they still appear, check the duplicate logic
- localStorage also prevents local duplicates

### Issue: ".env.local not working"
**Solution:**
```powershell
# Make sure file is named exactly:
".env.local"

# Not:
".env.local.txt"
"env.local"

# Restart dev server after creating
```

---

## 📧 Export Emails for Launch Day

### When you're ready to send launch emails:

**Option 1: Copy from Sheet**
1. Select all emails in column A
2. Copy (Ctrl+C)
3. Paste into your email service

**Option 2: Download CSV**
1. File → Download → CSV
2. Import to Mailchimp/SendGrid/etc.

**Option 3: Use Apps Script**
Create a function to auto-send emails:

```javascript
function sendLaunchEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const emails = sheet.getRange('A2:A').getValues().flat().filter(e => e);
  
  emails.forEach(email => {
    // Use your email service API here
    // Or MailApp.sendEmail() for Gmail
  });
}
```

---

## 🎨 Customize Your Sheet

### Add Pretty Formatting:
1. Header row: Bold + Background color
2. Conditional formatting: Highlight recent signups
3. Add charts: Signups over time
4. Create dashboard tab

### Add More Columns:
You can track additional data like:
- IP address
- Device type (mobile/desktop)
- UTM parameters
- Geographic location
- Referral code

Just update the Apps Script to include more fields!

---

## 📊 Advanced: Real-Time Dashboard

### Create a live counter in your sheet:

**Sheet 2 - Dashboard:**
```
╔═══════════════════════════════════╗
║   FASHUN.CO WAITLIST DASHBOARD   ║
╠═══════════════════════════════════╣
║  Total Signups:        247        ║
║  Today:                 42        ║
║  This Week:            156        ║
║  Yesterday:             38        ║
╚═══════════════════════════════════╝
```

Formulas:
```javascript
// Total: =COUNTA(Sheet1!A:A)-1
// Today: =COUNTIF(Sheet1!B:B,">="&TODAY())
// Week: =COUNTIF(Sheet1!B:B,">="&TODAY()-7)
// Yesterday: =COUNTIFS(Sheet1!B:B,">="&TODAY()-1,Sheet1!B:B,"<"&TODAY())
```

---

## 🚀 Production Deployment

### When deploying to production (Vercel/Netlify):

1. Add environment variable in hosting dashboard:
   - Key: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: Your Web App URL

2. Don't commit `.env.local` to git!

3. Test on production URL before announcing

---

## ✅ Setup Checklist

- [ ] Created Google Sheet with headers
- [ ] Created Apps Script
- [ ] Deployed as Web App
- [ ] Copied Web App URL
- [ ] Added URL to `.env.local`
- [ ] Restarted dev server
- [ ] Tested email submission
- [ ] Verified email appears in sheet
- [ ] Checked for duplicate prevention
- [ ] Formatted sheet nicely

---

## 🎉 You're All Set!

Once configured, your waitlist will:
- ✅ Auto-save to Google Sheets
- ✅ Prevent duplicates
- ✅ Track timestamps
- ✅ Work in real-time
- ✅ Be accessible anywhere
- ✅ Easy to export/share

**Your emails are now safely stored in the cloud! 📊**

---

## 📞 Need Help?

### Quick Test Command:
```powershell
# Test the API endpoint directly:
Invoke-WebRequest -Uri "http://localhost:3000/api/waitlist" `
  -Method POST `
  -Body '{"email":"test@example.com"}' `
  -ContentType "application/json"
```

### Check Logs:
- Browser Console (F12)
- Apps Script Logs (View → Executions)
- Network tab (check API calls)

---

**Pro Tip:** Keep your Google Sheet open during launch to watch signups come in real-time! It's super exciting! 🚀

---

*Setup guide created: October 23, 2025*  
*Questions? Check the logs or test step-by-step!*
