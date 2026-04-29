#!/bin/bash
# deploy.sh - Deploy all components

set -e

echo "🚀 SWARM OS - Production Deployment"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check environment
if [ -z "$PRIVATE_KEY" ]; then
  echo "${RED}❌ PRIVATE_KEY not set${NC}"
  exit 1
fi

if [ -z "$RPC_URL" ]; then
  echo "${RED}❌ RPC_URL not set${NC}"
  exit 1
fi

# Deploy Backend
echo "${BLUE}1️⃣  Building Backend...${NC}"
cd backend
npm run build
echo "${GREEN}✓ Backend built${NC}"
cd ..

# Deploy Frontend
echo ""
echo "${BLUE}2️⃣  Building Frontend...${NC}"
cd frontend
npm run build
echo "${GREEN}✓ Frontend built${NC}"
cd ..

# Deploy Contracts
echo ""
echo "${BLUE}3️⃣  Deploying Smart Contracts...${NC}"
cd contracts
echo "Compiling Solidity..."
forge build
echo "Deploying to $RPC_URL...$"
forge script src/Deploy.sol:DeployScript \
  --rpc-url "$RPC_URL" \
  --broadcast \
  --private-key "$PRIVATE_KEY"
echo "${GREEN}✓ Contracts deployed${NC}"
cd ..

echo ""
echo "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo "${BLUE}║  ✅ Deployment Complete!                  ║${NC}"
echo "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""
echo "${YELLOW}📝 Next steps:${NC}"
echo "1. Update contract address in frontend/.env"
echo "2. Deploy frontend to hosting (Vercel, Netlify, etc.)"
echo "3. Deploy backend to cloud (AWS, Heroku, etc.)"
echo ""
