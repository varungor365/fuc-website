# AI Image Generation with Gemini

This system implements a 3-stage AI-powered image generation and replacement workflow for the FASHUN.CO platform.

## Overview

The AI Image Generation system uses Google Gemini AI and Perplexity AI to automatically identify, analyze, and replace stock images throughout the platform with custom-generated content that matches the brand aesthetic.

## Architecture

### Stage 1: Backend API (✅ Complete)
- **Location**: `/src/app/api/generate-image/route.ts`
- **Purpose**: Secure serverless function for AI image generation
- **Features**:
  - Google Gemini AI integration
  - Multiple style options (realistic, artistic, minimal, fashion)
  - Configurable aspect ratios (1:1, 16:9, 4:3, 3:4)
  - Input validation and error handling
  - API key security

### Stage 2: Frontend Interface (✅ Complete)
- **Location**: `/src/components/admin/ImageGenerator.tsx`
- **Admin Page**: `/src/app/(admin)/ai-generator/page.tsx`
- **Purpose**: User-friendly interface for generating images
- **Features**:
  - Real-time prompt input with character counter
  - Style and aspect ratio selection
  - Quick suggestion prompts
  - Image preview and download
  - Copy URL functionality
  - Loading states and error handling

### Stage 3: Automated Workflow (✅ Complete)
- **Location**: `/scripts/ai-image-replacement.js`
- **Purpose**: Automated stock image detection and replacement
- **Features**:
  - Codebase scanning for stock images
  - Perplexity AI for contextual prompt generation
  - Automated image generation and replacement
  - Git integration for change tracking
  - Comprehensive reporting

## API Endpoints

### POST `/api/generate-image`
Generate a new image using AI.

**Request Body:**
```json
{
  "prompt": "A stylish streetwear model in urban setting",
  "style": "fashion",
  "aspectRatio": "16:9",
  "quality": "high"
}
```

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://generated-image-url.com/image.jpg",
  "metadata": {
    "prompt": "...",
    "style": "fashion",
    "aspectRatio": "16:9",
    "generatedAt": "2025-01-15T10:30:00Z"
  }
}
```

### GET `/api/generate-image`
Get API information and supported options.

**Response:**
```json
{
  "service": "Gemini AI Image Generation",
  "status": "Available",
  "version": "1.0.0",
  "supportedStyles": ["realistic", "artistic", "minimal", "fashion"],
  "supportedAspectRatios": ["1:1", "16:9", "4:3", "3:4"],
  "maxPromptLength": 1000
}
```

## Environment Configuration

Add these environment variables to `.env.local`:

```bash
# AI Services
GEMINI_API_KEY=your_gemini_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
```

## Usage

### Manual Image Generation

1. Navigate to `/admin/ai-generator` in the admin panel
2. Enter a descriptive prompt for your desired image
3. Select style and aspect ratio options
4. Click "Generate Image"
5. Download or copy the generated image URL

### Automated Stock Image Replacement

Run the automated workflow to scan and replace stock images:

```bash
# Full replacement workflow
npm run ai:replace-images

# Preview mode (no actual changes)
npm run ai:replace-images:dry

# Verbose output for debugging
npm run ai:replace-images:verbose
```

### Command Line Options

```bash
# Basic usage
node scripts/ai-image-replacement.js

# Dry run (preview only)
node scripts/ai-image-replacement.js --dry-run

# Verbose logging
node scripts/ai-image-replacement.js --verbose

# Skip git commit
node scripts/ai-image-replacement.js --skip-git
```

## Configuration

The automated workflow can be configured in `/scripts/ai-image-replacement.js`:

```javascript
const CONFIG = {
  scanDirectories: ['src', 'public'],
  excludeDirectories: ['node_modules', '.next', 'build', '.git'],
  imageExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.svg'],
  stockImagePatterns: [
    /placeholder/i,
    /stock/i,
    /demo/i,
    /sample/i,
    /temp/i,
    /default/i
  ],
  maxImagesPerRun: 10,
};
```

## Features

### Smart Detection
- Scans codebase for stock image patterns in filenames
- Analyzes code references to images
- Prioritizes images by importance and visibility

### Contextual Analysis
- Uses Perplexity AI to understand image context
- Generates appropriate prompts based on usage location
- Considers brand guidelines and aesthetic requirements

### Professional Quality
- Multiple style options for different use cases
- High-quality generation settings
- Brand-consistent output

### Automation & Safety
- Dry-run mode for safe testing
- Comprehensive error handling
- Detailed reporting and logging
- Git integration for change tracking

## Integration with Admin Dashboard

The AI Image Generator is integrated into the admin sidebar navigation:
- **Location**: Admin Panel → AI Generator
- **Icon**: Photo icon in the sidebar
- **Access**: Available to admin users

## Workflow Reports

The automated workflow generates detailed reports:
- Processing duration and statistics
- List of found and processed images
- Error logs and resolution suggestions
- Git commit information

Reports are saved as JSON files with timestamps for auditing.

## Security Features

- API key validation and secure storage
- Input sanitization and validation
- Rate limiting protection
- Error message sanitization
- Secure image URL handling

## Future Enhancements

1. **Batch Processing**: Process multiple images simultaneously
2. **Style Learning**: Learn from brand preferences over time
3. **A/B Testing**: Compare generated vs. original images
4. **Integration**: Direct CMS integration for content updates
5. **Analytics**: Track usage patterns and success rates

## Troubleshooting

### Common Issues

1. **API Key Not Found**
   - Ensure `GEMINI_API_KEY` and `PERPLEXITY_API_KEY` are set in `.env.local`
   - Restart the development server after adding keys

2. **Generation Fails**
   - Check API key validity and quota limits
   - Verify prompt length (max 1000 characters)
   - Review network connectivity

3. **Workflow Errors**
   - Run with `--verbose` flag for detailed logging
   - Check file permissions for write operations
   - Verify git repository status

### Debug Mode

Enable verbose logging for detailed debugging:

```bash
# Frontend debugging
# Check browser console for detailed logs

# Backend debugging
# Check terminal output with --verbose flag

# API debugging
# Monitor API response status codes and error messages
```

## Support

For issues or questions about the AI Image Generation system:
1. Check the error logs and reports
2. Review the configuration settings
3. Test with dry-run mode first
4. Verify API key status and quotas

---

**Last Updated**: September 26, 2025
**Version**: 1.0.0
**Status**: Production Ready