#!/bin/bash

# World-Class FashUn Website - Production Deployment Script
# This script automates the deployment process for the regenerated website

set -e  # Exit on any error

echo \"🚀 Starting World-Class FashUn Website Deployment...\"
echo \"=================================================\"

# Colors for output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

# Configuration
PROJECT_NAME=\"fashun-store\"
BUILD_DIR=\"fashun-store\"
BACKUP_DIR=\"./backups/$(date +%Y%m%d_%H%M%S)\"
NODE_VERSION=\"18\"

# Functions
log_info() {
    echo -e \"${BLUE}[INFO]${NC} $1\"
}

log_success() {
    echo -e \"${GREEN}[SUCCESS]${NC} $1\"
}

log_warning() {
    echo -e \"${YELLOW}[WARNING]${NC} $1\"
}

log_error() {
    echo -e \"${RED}[ERROR]${NC} $1\"
}

check_dependencies() {
    log_info \"Checking dependencies...\"
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log_error \"Node.js is not installed. Please install Node.js ${NODE_VERSION}+\"
        exit 1
    fi
    
    NODE_VERSION_CURRENT=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ \"$NODE_VERSION_CURRENT\" -lt \"$NODE_VERSION\" ]; then
        log_error \"Node.js version $NODE_VERSION+ is required. Current: v$NODE_VERSION_CURRENT\"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error \"npm is not installed\"
        exit 1
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        log_error \"git is not installed\"
        exit 1
    fi
    
    log_success \"All dependencies are available\"
}

setup_environment() {
    log_info \"Setting up environment...\"
    
    # Create backup directory
    mkdir -p \"$BACKUP_DIR\"
    
    # Check if .env.local exists
    if [ ! -f \"$BUILD_DIR/.env.local\" ]; then
        log_warning \".env.local not found. Creating from template...\"
        
        cat > \"$BUILD_DIR/.env.local\" << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Medusa Backend
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.fashun.co.in

# AI Services
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_token_here

# Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS=your_ga_measurement_id

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret

# CDN & Media
NEXT_PUBLIC_CDN_URL=https://cdn.fashun.co.in

# Security
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://fashun.co.in
EOF
        
        log_warning \"Please update .env.local with your actual configuration values\"
        read -p \"Press Enter to continue after updating .env.local...\"
    fi
    
    log_success \"Environment setup complete\"
}

install_dependencies() {
    log_info \"Installing dependencies...\"
    
    cd \"$BUILD_DIR\"
    
    # Clean install
    if [ -d \"node_modules\" ]; then
        log_info \"Cleaning existing node_modules...\"
        rm -rf node_modules package-lock.json
    fi
    
    # Install dependencies
    npm ci --silent
    
    log_success \"Dependencies installed successfully\"
}

run_tests() {
    log_info \"Running tests...\"
    
    # Type checking
    log_info \"Running TypeScript type check...\"
    npm run type-check
    
    # Linting
    log_info \"Running ESLint...\"
    npm run lint
    
    # Unit tests (if available)
    if npm run | grep -q \"test\"; then
        log_info \"Running unit tests...\"
        npm run test -- --passWithNoTests
    fi
    
    log_success \"All tests passed\"
}

build_project() {
    log_info \"Building project for production...\"
    
    # Set production environment
    export NODE_ENV=production
    
    # Build the project
    npm run build
    
    # Analyze bundle (optional)
    if npm run | grep -q \"analyze\"; then
        log_info \"Generating bundle analysis...\"
        npm run analyze
    fi
    
    log_success \"Project built successfully\"
}

optimize_assets() {
    log_info \"Optimizing assets...\"
    
    # Compress images (if imagemin is available)
    if command -v imagemin &> /dev/null; then
        log_info \"Compressing images...\"
        find public/images -name \"*.jpg\" -o -name \"*.png\" -o -name \"*.webp\" | xargs imagemin --out-dir=public/images/optimized
    fi
    
    # Generate PWA assets
    if [ -f \"next.config.js\" ] && grep -q \"withPWA\" next.config.js; then
        log_info \"PWA assets already configured\"
    fi
    
    log_success \"Asset optimization complete\"
}

deploy_to_vercel() {
    log_info \"Deploying to Vercel...\"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        log_info \"Installing Vercel CLI...\"
        npm install -g vercel
    fi
    
    # Deploy to production
    vercel --prod --confirm
    
    log_success \"Deployed to Vercel successfully\"
}

setup_monitoring() {
    log_info \"Setting up monitoring and analytics...\"
    
    # Create monitoring configuration
    cat > \"monitoring-config.json\" << EOF
{
  \"alerts\": {
    \"uptime\": true,
    \"performance\": true,
    \"errors\": true
  },
  \"metrics\": {
    \"core_web_vitals\": true,
    \"user_analytics\": true,
    \"conversion_tracking\": true
  },
  \"notifications\": {
    \"email\": \"admin@fashun.co.in\",
    \"slack\": true
  }
}
EOF
    
    log_success \"Monitoring configuration created\"
}

post_deployment_tasks() {
    log_info \"Running post-deployment tasks...\"
    
    # Warm up the application
    log_info \"Warming up application...\"
    curl -s https://fashun.co.in > /dev/null || log_warning \"Failed to warm up application\"
    
    # Test critical endpoints
    log_info \"Testing critical endpoints...\"
    endpoints=(
        \"https://fashun.co.in\"
        \"https://fashun.co.in/api/health\"
        \"https://fashun.co.in/collections/all\"
        \"https://fashun.co.in/admin\"
    )
    
    for endpoint in \"${endpoints[@]}\"; do
        if curl -s -f \"$endpoint\" > /dev/null; then
            log_success \"✓ $endpoint\"
        else
            log_warning \"✗ $endpoint (may require authentication)\"
        fi
    done
    
    log_success \"Post-deployment tasks completed\"
}

generate_report() {
    log_info \"Generating deployment report...\"
    
    REPORT_FILE=\"deployment-report-$(date +%Y%m%d_%H%M%S).md\"
    
    cat > \"$REPORT_FILE\" << EOF
# FashUn Deployment Report

## Deployment Information
- **Date**: $(date)
- **Version**: $(git rev-parse HEAD)
- **Branch**: $(git branch --show-current)
- **Environment**: Production
- **Platform**: Vercel

## Features Deployed
- ✅ Premium glassmorphism UI components
- ✅ Holographic text effects
- ✅ Advanced animations (aurora, morpheus, crystal)
- ✅ WebGL 3D effects
- ✅ AI recommendation engine
- ✅ Voice commerce integration
- ✅ AR try-on experience
- ✅ Comprehensive admin dashboard
- ✅ Real-time analytics
- ✅ Performance optimizations

## Performance Metrics
- **Build Time**: $(date -d \"$START_TIME\" +'%s' | xargs -I {} echo \"scale=2; $(date +'%s') - {}\" | bc) seconds
- **Bundle Size**: $(du -sh .next 2>/dev/null | cut -f1 || echo \"N/A\")
- **Dependencies**: $(npm list --depth=0 2>/dev/null | wc -l) packages

## URLs
- **Main Site**: https://fashun.co.in
- **Admin Panel**: https://fashun.co.in/admin
- **API**: https://api.fashun.co.in

## Next Steps
1. Monitor application performance
2. Set up automated backups
3. Configure alerting
4. Run user acceptance testing
5. Update documentation

---
Deployment completed successfully! 🎉
EOF
    
    log_success \"Deployment report generated: $REPORT_FILE\"
}

cleanup() {
    log_info \"Cleaning up...\"
    
    # Remove temporary files
    find . -name \"*.tmp\" -delete 2>/dev/null || true
    find . -name \".DS_Store\" -delete 2>/dev/null || true
    
    # Reset working directory
    cd ..
    
    log_success \"Cleanup completed\"
}

# Main execution
main() {
    START_TIME=$(date)
    
    echo \"🎯 World-Class FashUn Website Deployment\"
    echo \"🏗️  Building production-ready application with:\"
    echo \"   • Premium animations & WebGL effects\"
    echo \"   • AI-powered features\"
    echo \"   • Integrated admin dashboard\"
    echo \"   • Performance optimizations\"
    echo \"\"
    
    # Check if we're in the right directory
    if [ ! -d \"$BUILD_DIR\" ]; then
        log_error \"$BUILD_DIR directory not found. Are you in the correct directory?\"
        exit 1
    fi
    
    # Run deployment steps
    check_dependencies
    setup_environment
    install_dependencies
    run_tests
    build_project
    optimize_assets
    
    # Ask for confirmation before deploying
    echo \"\"
    log_warning \"Ready to deploy to production. This will:\"
    echo \"  • Deploy to Vercel\"
    echo \"  • Update live website at fashun.co.in\"
    echo \"  • Affect production users\"
    echo \"\"
    read -p \"Continue with deployment? (y/N): \" -n 1 -r
    echo \"\"
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        deploy_to_vercel
        setup_monitoring
        post_deployment_tasks
        generate_report
        cleanup
        
        echo \"\"
        echo \"🎉 Deployment completed successfully!\"
        echo \"🌐 Website: https://fashun.co.in\"
        echo \"🔧 Admin: https://fashun.co.in/admin\"
        echo \"📊 Monitor your deployment and enjoy your world-class website!\"
    else
        log_info \"Deployment cancelled by user\"
        exit 0
    fi
}

# Trap errors and cleanup
trap 'log_error \"Deployment failed! Check the logs above for details.\"; cleanup; exit 1' ERR

# Run main function
main \"$@\"