#!/bin/bash
# ============================================================
# SWARM OS — One-Command Setup
# ============================================================

set -e

echo ""
echo "============================================================"
echo "🐝 SWARM OS — Setup"
echo "============================================================"
echo ""

# ── Backend ──────────────────────────────────────────────────
echo "[1/4] Installing backend dependencies..."
cd backend
npm install
cd ..
echo "  ✓ Backend dependencies installed"

# ── Frontend ─────────────────────────────────────────────────
echo ""
echo "[2/4] Installing frontend dependencies..."
cd frontend
npm install
cd ..
echo "  ✓ Frontend dependencies installed"

# ── Environment ──────────────────────────────────────────────
echo ""
echo "[3/4] Setting up environment..."
if [ ! -f backend/.env ]; then
    cp .env.example backend/.env
    echo "  ✓ Created backend/.env from template"
    echo "  ⚠ IMPORTANT: Edit backend/.env and add your API key(s)"
else
    echo "  ✓ backend/.env already exists"
fi

# ── Verify ───────────────────────────────────────────────────
echo ""
echo "[4/4] Verifying setup..."
cd backend && npx tsc --noEmit 2>/dev/null && echo "  ✓ Backend TypeScript: OK" || echo "  ✗ Backend TypeScript: errors found"
cd ../frontend && npx tsc --noEmit 2>/dev/null && echo "  ✓ Frontend TypeScript: OK" || echo "  ✗ Frontend TypeScript: errors found"
cd ..

echo ""
echo "============================================================"
echo "✅ Setup complete!"
echo ""
echo "To run SWARM OS:"
echo ""
echo "  Terminal 1:  cd backend  && npm run dev"
echo "  Terminal 2:  cd frontend && npm run dev"
echo ""
echo "Then open:     http://localhost:5173"
echo "============================================================"
echo ""
