# 🤖 Multi-Provider AI Setup Guide

## Overview

Your fashun.co.in website now includes a comprehensive multi-provider AI system with automatic fallback capabilities. This ensures 100% uptime for AI image generation by seamlessly switching between providers when one fails.

## Provider Chain

1. **🎨 Freepik API** (Primary) - Premium AI-generated fashion images
2. **📷 Pexels** (Secondary) - High-quality free stock photos with generous limits
3. **🤗 Hugging Face** (Tertiary) - Open-source models with generous free tier  
4. **🔄 Replicate** (Quaternary) - Latest cutting-edge models
5. **✂️ ClipDrop** (Final Fallback) - Stability AI suite with multiple tools

## Quick Setup

### 1. Get Your API Keys

#### Freepik API (Already Configured)
- ✅ **Status**: Ready to use
- 🔑 **API Key**: `FPSX231f0a23b48d96bd0d59894cfe7d8117`
- 💰 **Cost**: Pay-per-use with €5 free credits

#### Pexels (Already Configured)
- ✅ **Status**: Ready to use
- 🔑 **API Key**: `KJWWcdUA07x2yLwj7s8KnYb5w6OfkRMxY9HCxpsVAJZY8uEisULVeXIy`
- 💰 **Cost**: Free with 200 requests/hour, 20,000/month
- 📝 **Docs**: https://www.pexels.com/api/documentation/

#### Hugging Face (Free Tier Available)
1. Go to https://huggingface.co/join
2. Sign up for a free account
3. Navigate to Settings → Access Tokens
4. Create a new token with "Read" permissions
5. Copy your token and add to `.env.local`

#### Replicate (Free Starting Credits)
1. Visit https://replicate.com/signin
2. Sign up for a free account  
3. Go to Account → API Tokens
4. Create a new API token
5. Copy your token and add to `.env.local`

#### ClipDrop (Free Tier Available)
1. Go to https://clipdrop.co/apis
2. Sign up for a free account
3. Navigate to your dashboard
4. Generate an API key
5. Copy your key and add to `.env.local`

### 2. Update Environment Variables

Add these to your `.env.local` file:

```env
# Multi-Provider AI Configuration

# Hugging Face Inference API (Free tier available)
HUGGING_FACE_API_KEY=your_hugging_face_api_key_here

# Replicate API (Free starting credits)
REPLICATE_API_TOKEN=your_replicate_api_token_here

# ClipDrop API by Stability AI (Free tier available)
CLIPDROP_API_KEY=your_clipdrop_api_key_here
```

### 3. Test Your Setup

1. Start your development server: `npm run dev`
2. Visit `/ai-dashboard` to monitor provider health
3. Go to `/customize` to test AI generation
4. Try generating an image to see the fallback system in action

## Features

### 🔄 Automatic Fallback System
- **Zero Downtime**: If one provider fails, instantly switches to the next
- **Smart Routing**: Monitors provider health and routes requests optimally
- **Cost Optimization**: Uses free tiers when available before paid services

### 📊 Real-Time Monitoring
- **Provider Health Dashboard**: Monitor all providers in real-time
- **Performance Metrics**: Track response times and success rates
- **Fallback Statistics**: See which providers are being used

### 🎨 Enhanced AI Generation
- **Multiple Models**: Access to dozens of AI models across providers
- **Quality Optimization**: Each provider brings unique strengths
- **Style Consistency**: Maintains consistent output across providers

## Provider Benefits

### 📷 Pexels
- **Free High-Resolution**: No cost for high-quality photos
- **No Attribution Required**: Use images without crediting
- **Generous Limits**: 200 requests/hour, 20,000/month
- **Fashion Focus**: Excellent fashion and lifestyle photography
- **Instant Access**: No approval process required

### 🤗 Hugging Face
- **Free Tier**: Generous monthly allowance
- **Open Source**: Access to community models
- **Cutting Edge**: Latest research implementations
- **Models**: Stable Diffusion variants, FLUX, Anime models

### 🔄 Replicate
- **Latest Models**: First to host new popular models
- **Easy Integration**: Simple API design
- **Quality Focus**: Curated selection of high-quality models
- **Models**: SDXL, FLUX Schnell, specialized anime/realistic models

### ✂️ ClipDrop
- **Multi-Tool Platform**: Beyond just generation
- **Background Removal**: Automatic image processing
- **AI Upscaling**: Enhance image resolution
- **Stability AI**: Backed by leading AI research

## Cost Management

### Free Tier Maximization
1. **Pexels**: Primary choice for fashion photography (completely free)
2. **Hugging Face**: Use for bulk generation (free tier)
3. **Replicate**: Utilize starting credits efficiently  
4. **ClipDrop**: Leverage monthly free API calls
5. **Freepik**: Premium quality when budget allows

### Automatic Cost Optimization
- System preferentially uses free tiers
- Falls back to paid services only when necessary
- Tracks usage and provides cost insights

## Troubleshooting

### Provider Not Working?
1. Check API key configuration in `.env.local`
2. Verify key permissions and quotas
3. Visit `/ai-dashboard` for real-time status
4. Check provider documentation for updates

### All Providers Failing?
1. Check internet connectivity
2. Verify environment variables are loaded
3. Restart development server
4. Check provider status pages

### Slow Generation?
1. Monitor provider latency in dashboard
2. Consider adjusting provider preference order
3. Check for rate limiting

## Advanced Configuration

### Custom Provider Order
Set preferred provider order in `.env.local`:

```env
AI_PROVIDER_PREFERENCE=hugging_face,freepik,replicate,clipdrop
```

### Provider-Specific Settings
Each provider can be configured for specific use cases:
- **Freepik**: Professional fashion images
- **Hugging Face**: Experimental and artistic styles
- **Replicate**: Latest model testing
- **ClipDrop**: Image enhancement and processing

## Monitoring & Analytics

### Dashboard Features
- Real-time provider health status
- Response time monitoring
- Success/failure rates
- Cost tracking per provider
- Fallback frequency analysis

### Usage Insights
- Most reliable providers
- Peak usage times
- Cost optimization opportunities
- Quality comparison across providers

## Best Practices

### 1. API Key Security
- Never commit API keys to version control
- Use environment variables for all keys
- Regularly rotate keys for security
- Monitor usage for unauthorized access

### 2. Quota Management
- Monitor free tier limits
- Set up billing alerts
- Track usage patterns
- Plan for scaling needs

### 3. Quality Optimization
- Test prompts across providers
- Use provider strengths strategically
- Monitor output quality metrics
- Collect user feedback

## Support

### Provider Documentation
- [Freepik API Docs](https://docs.freepik.com/)
- [Hugging Face API Docs](https://huggingface.co/docs/api-inference/)
- [Replicate API Docs](https://replicate.com/docs)
- [ClipDrop API Docs](https://clipdrop.co/apis/docs)

### Need Help?
1. Check provider status dashboards
2. Review API documentation
3. Monitor system logs
4. Contact provider support if needed

---

## 🎉 Ready to Go!

Your multi-provider AI system is now configured for maximum reliability and performance. The automatic fallback system ensures your users never experience downtime, while the diverse provider ecosystem gives you access to the best AI models available.

Visit `/customize` to start creating amazing AI-generated designs! 🎨✨