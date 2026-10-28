import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, it } from 'vitest';
import { QUERY_KEYS } from './queryKeys';

const SRC = join(import.meta.dirname, '..');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith('.spec.ts')
      ? [path]
      : [];
  });
}

// A key written right after one of these calls is an invalidation or a cache
// read, not a query.
const NOT_A_QUERY =
  /(invalidateQueries|refetchQueries|removeQueries|cancelQueries|resetQueries|setQueryData|getQueryData)\(\s*\{?\s*(queryKey:\s*)?$/;

function queriedKeys(): Set<string> {
  const queried = new Set<string>();
  for (const file of sourceFiles(SRC)) {
    const text = readFileSync(file, 'utf8');
    for (const match of text.matchAll(/qk\(\s*'([^']+)'/g)) {
      const before = text.slice(Math.max(0, match.index - 60), match.index);
      if (!NOT_A_QUERY.test(before)) queried.add(match[1]);
    }
    for (const match of text.matchAll(
      /(?:usePagedList|usePaymentQuote)(?:<[^>]*>)?\(\s*'([^']+)'/g
    )) {
      queried.add(match[1]);
    }
  }
  return queried;
}

describe('claves de consulta', () => {
  it('cada clave del registro la lee alguna consulta', () => {
    const queried = queriedKeys();

    expect(QUERY_KEYS.filter((key) => !queried.has(key))).toEqual([]);
  });

  it('el registro no repite una clave', () => {
    expect(new Set(QUERY_KEYS).size).toBe(QUERY_KEYS.length);
  });
});
