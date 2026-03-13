#!/bin/bash
# ── Reply Smart Launcher ─────────────────────────────────
# Run this once to start the app. Open http://localhost:3000/reply-smart.html

cd "$(dirname "$0")"

# Check for .env
if [ ! -f .env ]; then
  echo ""
  echo "⚠️  First-time setup:"
  echo "   Create a file called .env in this folder with:"
  echo ""
  echo "   ANTHROPIC_API_KEY=sk-ant-api03-YOUR_KEY_HERE"
  echo ""
  echo "   Then run this script again."
  exit 1
fi

# Install deps if needed
if [ ! -d node_modules ]; then
  echo "📦 Installing dependencies..."
  npm install --silent
fi

echo ""
echo "✨ Starting Reply Smart..."
echo "   Open: http://localhost:3000/reply-smart.html"
echo "   Press Ctrl+C to stop."
echo ""
node server.js
