#!/bin/bash
# setup-frontend.sh - Setup frontend environment

set -e

echo "🚀 SWARM OS Frontend Setup"
echo "=========================="

cd frontend

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
  echo "⚠️  Please verify settings in frontend/.env:"
  echo "   - REACT_APP_API_URL (should match backend)"
  echo "   - REACT_APP_INFT_CONTRACT (after deployment)"
  echo ""
  echo "Then run: npm start"
else
  echo "✓ .env already exists"
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify frontend/.env settings"
echo "2. Run: npm start"
echo "3. Frontend will open on http://localhost:3000"
