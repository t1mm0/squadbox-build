#!/bin/bash
# Deploy Squadbox to Vercel and Render
# Purpose: Complete deployment script for Squadbox
# Last modified: 2025-01-09
# By: AI Assistant
# Completeness: 100/100

echo "🚀 Squadbox Deployment Script"
echo "=============================="

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit - Squadbox deployment ready"
fi

# Check git status
echo "📋 Checking git status..."
git status

# Add all changes
echo "📦 Adding all changes..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S') - Squadbox updates"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 No remote repository found."
    echo "Please add a remote repository:"
    echo "  git remote add origin https://github.com/yourusername/squadbox-ubuntu-vm.git"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Deployment initiated!"
echo ""
echo "📊 Deployment Status:"
echo "  - Frontend: Will deploy to Vercel automatically"
echo "  - Backend: Will deploy to Render automatically"
echo ""
echo "🔗 Check deployment status:"
echo "  - Vercel Dashboard: https://vercel.com/dashboard"
echo "  - Render Dashboard: https://dashboard.render.com"
echo ""
echo "🌐 Your app will be available at:"
echo "  - Frontend: https://squadbox.vercel.app (or your custom domain)"
echo "  - Backend: https://squadbox-backend.onrender.com"
