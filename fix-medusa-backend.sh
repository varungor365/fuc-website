#!/bin/bash

echo "🔧 Fixing Medusa Backend..."

# Stop the crashing application
echo "⏹️ Stopping pm2 process..."
pm2 stop medusa-backend

# Navigate to backend directory
cd ~/fashun-backend

# Run the build command
echo "🏗️ Building Medusa backend..."
npx medusa build

# Wait for build to complete
echo "⏳ Waiting for build to complete..."
sleep 5

# Restart the application
echo "🚀 Restarting Medusa backend..."
pm2 restart medusa-backend

# Check status
echo "✅ Checking status..."
pm2 status medusa-backend

# Show logs
echo "📋 Showing logs..."
pm2 logs medusa-backend --lines 20

echo "✅ Done! Backend should be running on port 9000"
