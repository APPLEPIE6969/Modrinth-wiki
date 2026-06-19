import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getGameVersions } from '../lib/api.ts';

const mockGameVersions = [
  { version: '1.20', version_type: 'release', date: '2023-06-07T00:00:00Z', major: true },
  { version: '1.20.1', version_type: 'release', date: '2023-06-12T00:00:00Z', major: false },
  { version: '23w14a', version_type: 'snapshot', date: '2023-04-05T00:00:00Z', major: false },
];

describe('getGameVersions', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should return filtered and sorted release versions on success', async () => {
    global.fetch = (async () => ({
      ok: true,
      json: async () => mockGameVersions,
    })) as any;

    const result = await getGameVersions();

    assert.strictEqual(result.length, 2);
    // Should be sorted by date descending: 1.20.1 is later than 1.20
    assert.strictEqual(result[0].version, '1.20.1');
    assert.strictEqual(result[1].version, '1.20');
    assert.ok(result.every(v => v.version_type === 'release'));
  });

  it('should return an empty array on network rejection', async () => {
    global.fetch = (async () => {
      throw new Error('Network failure');
    }) as any;

    const result = await getGameVersions();

    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 0);
  });

  it('should return an empty array when fetchLabrinth rejects due to non-OK response', async () => {
    global.fetch = (async () => ({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })) as any;

    const result = await getGameVersions();

    assert.ok(Array.isArray(result));
    assert.strictEqual(result.length, 0);
  });
});
