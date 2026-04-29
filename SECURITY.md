# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x (current) | ✅ |

## Reporting a Vulnerability

If you discover a security vulnerability in SWARM OS, please report it responsibly:

1. **Do NOT** open a public GitHub issue
2. Email: [maanya.jha12@gmail.com](mailto:maanya.jha12@gmail.com)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Considerations

### API Keys
- Never commit `.env` files (protected by `.gitignore`)
- Use `.env.example` as the template
- Rotate keys if accidentally exposed

### 0G Integration
- Private keys for 0G Chain are stored in `.env` only
- 0G Compute uses TEE verification for trustless inference
- All 0G Storage data has in-memory fallback (no data loss on network failure)

### WebSocket
- WebSocket connections are unauthenticated (development mode)
- Production deployments should add authentication middleware

## Dependencies

We regularly monitor dependencies for known vulnerabilities. Run `npm audit` to check.
