#!/bin/bash

# Development script with optimized settings
echo "🚀 Starting development server with optimized settings..."

# Kill any existing Next.js processes
pkill -f "next dev" || true

# Clear Next.js cache
rm -rf .next

# Set development environment
export NODE_ENV=development
export NEXT_TELEMETRY_DISABLED=1

# Start the dev server
npm run dev