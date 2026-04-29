#!/bin/bash
# setup-backend.sh - Setup backend environment

set -e

echo "🚀 SWARM OS Backend Setup"
echo "========================"

cd backend

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if not exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from template..."
  cp .env.example .env
  echo "⚠️  Please edit .env with your settings:"
  echo "   - ANTHROPIC_API_KEY"
  echo "   - OG_COMPUTE_ENDPOINT"
  echo "   - PRIVATE_KEY"
  echo ""
  echo "Then run: npm run dev"
else
  echo "✓ .env already exists"
fi

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Run: npm run dev"
echo "3. Backend will start on http://localhost:5000"
