# Contributing to SWARM OS

Thank you for your interest in contributing to SWARM OS! This project is an autonomous multi-agent deliberation system built on the 0G Network, and we welcome contributions of all kinds.

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- Git
- At least one LLM API key (Anthropic or OpenAI)

### Setup

```bash
git clone https://github.com/Maanyajha-12/SWARMOS.git
cd SWARMOS
chmod +x setup-all.sh && ./setup-all.sh
cp .env.example backend/.env
# Edit backend/.env with your API key(s)
```

### Running Locally

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## 📋 How to Contribute

### Reporting Bugs

1. Check [existing issues](https://github.com/Maanyajha-12/SWARMOS/issues) first
2. Use the **Bug Report** template
3. Include: steps to reproduce, expected vs actual behavior, screenshots if applicable

### Suggesting Features

1. Open an issue with the **Feature Request** template
2. Describe the use case and why it improves SWARM OS

### Submitting Code

1. **Fork** the repository
2. **Create a branch**: `git checkout -b feature/your-feature`
3. **Make changes** following the coding standards below
4. **Test**: ensure `npx tsc --noEmit` passes for both backend and frontend
5. **Commit**: use [conventional commits](https://www.conventionalcommits.org/)
   ```
   feat: add arena tournament history export
   fix: resolve WebSocket reconnect on network change
   docs: update 0G Compute endpoint instructions
   ```
6. **Push** and open a **Pull Request**

## 🏗 Project Structure

```
backend/src/
├── index.ts              # API routes + WebSocket
├── agents.ts             # 4 AI agents + orchestrator
├── compute-verifier.ts   # 0G Compute integration
├── og-storage.ts         # 0G KV + Log storage
├── breeding.ts           # Genetic algorithm engine
└── traits.ts             # Trait management

frontend/src/
├── App.tsx               # Main navigation shell
├── components/           # 11 React components
├── services/             # WebSocket + REST clients
└── styles/               # Custom CSS
```

## 🎨 Coding Standards

### TypeScript

- Strict mode enabled
- No `any` unless interfacing with 0G external APIs
- All functions must have return types
- Use `interface` for data shapes, `type` for unions

### React Components

- Functional components with hooks only
- Props interfaces defined and exported
- Error boundaries around API calls

### CSS

- Use the design system variables from `index.css`
- Follow the glassmorphism dark theme
- Mobile-first responsive design

### Naming

- Files: `PascalCase.tsx` for components, `kebab-case.ts` for utilities
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- CSS classes: `kebab-case`

## 🔗 0G Integration Guidelines

When modifying 0G integrations:

- **0G Compute** (`compute-verifier.ts`): Always maintain the simulation fallback
- **0G Storage** (`og-storage.ts`): Always maintain the in-memory fallback
- **0G Chain** (`contracts/`): Test on Galileo testnet before deploying
- Never hardcode endpoints — use environment variables

## 🧪 Testing

```bash
# Type check
cd backend  && npx tsc --noEmit
cd frontend && npx tsc --noEmit

# Test API
curl http://localhost:5000/api/health | python3 -m json.tool

# Test deliberation
curl -X POST http://localhost:5000/api/deliberate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Test proposal"}'
```

## 📝 Commit Convention

| Prefix | Use For |
|--------|---------|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation |
| `style:` | CSS/formatting (no logic change) |
| `refactor:` | Code restructuring |
| `perf:` | Performance improvements |
| `test:` | Adding tests |
| `chore:` | Build/tooling changes |

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
