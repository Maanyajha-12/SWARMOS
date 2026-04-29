#!/bin/bash
# setup-contracts.sh - Setup smart contracts

set -e

echo "🚀 SWARM OS Contracts Setup"
echo "==========================="

cd contracts

# Check if forge is installed
if ! command -v forge &> /dev/null; then
  echo "❌ Foundry not installed. Installing..."
  curl -L https://foundry.paradigm.xyz | bash
  export PATH="$PATH:$HOME/.foundry/bin"
  echo "✓ Foundry installed"
else
  FORGE_VERSION=$(forge --version)
  echo "✓ Foundry version: $FORGE_VERSION"
fi

# Install dependencies
echo "📦 Installing dependencies..."
forge install

# Build contracts
echo "🔨 Building contracts..."
forge build

# Create .env if not exists
if [ ! -f .env ]; then
  echo "📝 Creating .env from template..."
  cp .env.example .env
  echo "⚠️  Please edit .env with your settings:"
  echo "   - PRIVATE_KEY"
  echo "   - RPC_URL"
  echo ""
  echo "Then deploy with:"
  echo "  source .env"
  echo "  forge script src/Deploy.sol:DeployScript --rpc-url \$RPC_URL --broadcast --private-key \$PRIVATE_KEY"
else
  echo "✓ .env already exists"
fi

echo ""
echo "✅ Contracts setup complete!"
echo ""
echo "Next steps:"
echo " 1. Edit contracts/.env with your deployment settings"
echo "2. Run deployment:"
echo "   source .env"
echo "   forge script src/Deploy.sol:DeployScript \\"
echo "     --rpc-url \$RPC_URL \\"
echo "     --broadcast \\"
echo "     --private-key \$PRIVATE_KEY"
echo "3. Copy deployed address to REACT_APP_INFT_CONTRACT in frontend/.env"
