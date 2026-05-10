# fingerprint-mcp

[![npm](https://img.shields.io/npm/v/@mukundakatta/fingerprint-mcp.svg)](https://www.npmjs.com/package/@mukundakatta/fingerprint-mcp)
[![mcp](https://img.shields.io/badge/protocol-MCP-blue.svg)](https://modelcontextprotocol.io)

MCP server: content hashing for cache keys, dedup, and fingerprinting.
SHA-256, SHA-512, SHA-1, MD5 — all from Node's built-in crypto.

## Tool: `fingerprint`

```json
{ "text": "hello world", "algorithm": "sha256", "encoding": "hex" }
```

→

```json
{ "algorithm": "sha256", "encoding": "hex", "digest": "b94d27b9..." }
```

Encodings: `hex` (default), `base64`, `base64url`.

MIT.
