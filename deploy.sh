#!/bin/bash

# FASHUN.CO Deployment Script
# This script ensures proper build configuration for Vercel deployment

echo "🚀 Starting FASHUN.CO deployment process..."

# Ensure we're in the fashun-store directory for Next.js build
cd fashun-store

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"
echo "🌐 Ready for deployment to Vercel"