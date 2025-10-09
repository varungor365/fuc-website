# 🚀 Vercel Deployment Environment Variables

## Required Environment Variables for Production

Add these in your Vercel Dashboard → Project Settings → Environment Variables:

### 🔐 Core Configuration
```
NEXT_PUBLIC_SUPABASE_URL=https://oyysorgjqeqxhmyczphk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eXNvcmdqcWVxeGhteWN6cGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjU4OTgsImV4cCI6MjA3NDQwMTg5OH0.s1qVEpeS3SIqHbuh4NJxpXzw7kYacpoAHYMV5QIZvCE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eXNvcmdqcWVxeGhteWN6cGhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODgyNTg5OCwiZXhwIjoyMDc0NDAxODk4fQ.jql_y2-LcUlK_KEzV2UnHMb9kPJiPRWbc11f7OWAxek
```

### 🎯 Site URLs
```
NEXT_PUBLIC_SITE_URL=https://www.fashun.co.in
NEXT_PUBLIC_APP_NAME=FASHUN.CO.IN
```

### 🤖 AI Service APIs
```
FREEPIK_API_KEY=FPSX231f0a23b48d96bd0d59894cfe7d8117
PEXELS_API_KEY=KJWWcdUA07x2yLwj7s8KnYb5w6OfkRMxY9HCxpsVAJZY8uEisULVeXIy
```

### ⚠️ Optional AI Services (Add if you have keys)
```
REPLICATE_API_TOKEN=r8_your_actual_token
HUGGING_FACE_API_KEY=hf_your_actual_key
CLIPDROP_API_KEY=your_actual_clipdrop_key
GEMINI_API_KEY=AIzaSy_your_actual_key
```

## 🔧 How to Add in Vercel:

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Set Environment: **Production** (and Preview if needed)
6. Click **Save**
7. Redeploy your project

## ✅ Build Success Indicators:

Your build should show:
- ✅ Next.js compilation successful
- ✅ Manifest.webmanifest generated
- ✅ Icon generation working
- ✅ API routes compiled
- ✅ No TypeScript errors

Current Status: **READY FOR PRODUCTION** 🚀