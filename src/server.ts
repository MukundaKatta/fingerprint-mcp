#!/usr/bin/env node
import { createHash } from 'node:crypto';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const VERSION = '0.1.1';
const ALGOS = ['sha256', 'sha512', 'sha1', 'md5'] as const;
const ENCODINGS = ['hex', 'base64', 'base64url'] as const;
type Algo = (typeof ALGOS)[number];
type Enc = (typeof ENCODINGS)[number];

export function fingerprint(text: string, algo: Algo, encoding: Enc): string {
  return createHash(algo).update(text).digest(encoding);
}

const server = new Server({ name: 'fingerprint', version: VERSION }, { capabilities: { tools: {} } });

const TOOLS = [
  {
    name: 'fingerprint',
    description:
      'Compute a content hash. Algorithms: sha256 (default), sha512, sha1, md5. Encodings: hex (default), base64, base64url. Use when you need a stable cache key, dedup id, or content fingerprint.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'Content to hash.' },
        algorithm: { type: 'string', enum: [...ALGOS], default: 'sha256' },
        encoding: { type: 'string', enum: [...ENCODINGS], default: 'hex' },
      },
      required: ['text'],
    },
  },
] as const;

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const { name, arguments: args } = req.params;
  try {
    if (name !== 'fingerprint') return errorResult('unknown tool: ' + name);
    const a = (args ?? {}) as { text?: unknown; algorithm?: unknown; encoding?: unknown };
    if (typeof a.text !== 'string') return errorResult('text is required and must be a string');
    const algo = a.algorithm ?? 'sha256';
    const enc = a.encoding ?? 'hex';
    if (!ALGOS.includes(algo as Algo)) return errorResult(`unsupported algorithm: ${String(algo)}`);
    if (!ENCODINGS.includes(enc as Enc)) return errorResult(`unsupported encoding: ${String(enc)}`);
    return jsonResult({
      algorithm: algo,
      encoding: enc,
      digest: fingerprint(a.text, algo as Algo, enc as Enc),
    });
  } catch (err) {
    return errorResult('internal error: ' + (err as Error).message);
  }
});

function jsonResult(value: unknown) {
  return { content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] };
}
function errorResult(message: string) {
  return { isError: true, content: [{ type: 'text', text: message }] };
}

// Only start the stdio server when run as a script — not when imported by tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`fingerprint MCP server v${VERSION} ready on stdio\n`);
}
