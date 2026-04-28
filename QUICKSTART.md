# 🚀 SWARM OS - Quick Start Guide

**Get the system running in 5 minutes**

---

## ⚡ Ultra-Fast Setup

### 1. Clone & Navigate

```bash
cd /home/maanya-jha/Desktop/SWARMOS
```

### 2. Make Scripts Executable

```bash
chmod +x setup-backend.sh setup-frontend.sh setup-contracts.sh setup-all.sh deploy.sh
```

### 3. Run Complete Setup

```bash
./setup-all.sh
```

This will:
✅ Install all dependencies  
✅ Create environment files  
✅ Check prerequisites  

### 4. Configure Environment

Edit these files with your API keys:

**Backend - `backend/.env`**
```bash
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE
OG_COMPUTE_ENDPOINT=http://localhost:8082
RPC_URL=https://rpc-testnet.0g.ai
PRIVATE_KEY=0x...
```

**Frontend - `frontend/.env`**
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_RPC_URL=https://rpc-testnet.0g.ai
```

**Contracts - `contracts/.env`**
```bash
PRIVATE_KEY=0x...
RPC_URL=https://rpc-testnet.0g.ai
```

### 5. Start All Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Should see: `🚀 SWARM OS Backend Server Started`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Should see: `Compiled successfully!` and opens browser

**Terminal 3 - Monitor:**
```bash
cd backend
tail -f logs.txt  # or npm run logs
```

### 6. Test the System

Open your browser:
```
http://localhost:3000
```

Type a prompt:
```
"Create a governance proposal for DAO treasury allocation"
```

Click "Start Deliberation" and watch real-time updates! ✨

---

## 📊 What's Happening

When you submit a prompt:

1. **Planner Agent** (2-3 sec) - Creates execution plan
2. **Researcher Agent** (3-5 sec) - Validates claims  
3. **Critic Agent** (2-3 sec) - Evaluates decision
4. **0G Compute** (3-7 sec) - Verifies on verifiable network ✅ NEW
5. **Executor Agent** (5-15 sec) - Executes plan
6. **iNFT Mint** (3-5 sec) - Creates proof NFT

**Total: ~18-38 seconds** for complete deliberation with cryptographic proof!

---

## 🔗 API Endpoints

### Start Deliberation

```bash
curl -X POST http://localhost:5000/api/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Your prompt here",
    "mode": "simulation"  # or "execution"
  }'
```

### Get Session Details

```bash
curl http://localhost:5000/api/session/sess_1234567890
```

### Monitor Agents

```bash
curl http://localhost:5000/api/agents
```

### System Health

```bash
curl http://localhost:5000/api/health
```

---

## 📁 File Structure

```
SWARMOS/
├── backend/           # Node.js Express server
│   ├── src/
│   │   ├── agents.ts         # 4 AI agents
│   │   ├── compute-verifier.ts # 0G integration ✨ NEW
│   │   ├── index.ts          # API routes
│   │   └── og-storage.ts     # 0G KV/Log
│   └── package.json
│
├── frontend/          # React dashboard
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeliberationPanel.tsx
│   │   │   ├── VerificationBadge.tsx   ✨ NEW
│   │   │   ├── VerdictPanel.tsx        ✨ NEW
│   │   │   ├── ExecutorPanel.tsx       ✨ NEW
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── websocket.ts
│   │   │   └── api.ts
│   │   └── App.tsx
│   └── package.json
│
├── contracts/         # Smart contracts
│   ├── src/
│   │   └── DeliberationINFT.sol  # iNFT ERC721 ✨ NEW
│   └── foundry.toml
│
└── README.md          # This file
```

---

## 🎯 Key Innovation: 0G Compute Verification

### Why it matters:

Without 0G Verify ❌
```
Agent says "Yes, do this"
Question: How do we know it's correct?
Answer: We don't. Trust the AI.
```

With 0G Compute ✅
```
Agent says "Yes, do this"
0G Compute verifies on decentralized network: "Correct with 89% confidence"
On-chain proof: 0x... (cryptographic hash)
Question: How do we know the verification is true?
Answer: Decentralized network attests to it.
```

**This is what makes SWARM OS production-grade for autonomous governance.**

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Check port 5000 is free
lsof -i :5000

# If occupied, kill it
kill -9 <PID>

# Or change PORT in backend/.env
PORT=5001 npm run dev
```

### Frontend can't connect
```bash
# Verify backend URL in frontend/.env
REACT_APP_API_URL=http://localhost:5000

# Check CORS is enabled in backend
# Should see: app.use(cors());
```

### 0G endpoints not found
```bash
# These are local by default
OG_KV_ENDPOINT=http://localhost:8080
OG_LOG_ENDPOINT=http://localhost:8081
OG_COMPUTE_ENDPOINT=http://localhost:8082

# For live network, use:
# OG_COMPUTE_ENDPOINT=https://compute.0g.ai (example)
```

### Contract deployment fails
```bash
# Verify Foundry
forge --version

# Check RPC URL
curl https://rpc-testnet.0g.ai -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Ensure private key is valid
echo "0x$PRIVATE_KEY" | wc -c  # Should be 66 chars
```

---

## 📚 Documentation

- **Main README**: `README.md` - Complete architecture
- **Backend**: `backend/README.md` - API & code structure
- **Frontend**: `frontend/README.md` - Components & WebSocket  
- **Contracts**: `contracts/README.md` - Smart contract info

---

## 🚀 Next Steps

1. ✅ Get system running (you should be here!)
2. 📝 Submit a test prompt and watch it work
3. 🔗 Deploy smart contracts to testnet
4. 🌐 Deploy frontend to Vercel/Netlify
5. ☁️ Deploy backend to AWS/Heroku
6. 🎉 Deploy to mainnet for production use

---

## 💡 What You Can Do

```
Submit: "Create a governance proposal for DAO treasury"
↓
System deliberates and produces:
  • Detailed execution plan
  • Verified research & evidence
  • Safety/legality scores
  • 0G Compute verification proof
  • Transaction hash (if executed)
  • iNFT token with proof
↓
Result: Autonomous decision with cryptographic proof
```

---

## 📞 Support

- **Issues?** Check README.md
- **Code questions?** See backend/README.md or frontend/README.md
- **Smart contracts?** Check contracts/README.md

---

**Status**: ✅ Ready to Deploy  
**Tech Stack**: Node.js + React + Solidity + 0G  
**Innovation**: On-chain verifiable autonomous decisions  

🎉 **You're ready to go! Start deliberating.**
