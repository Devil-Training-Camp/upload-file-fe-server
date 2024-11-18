import { expect, Mock, test, vi } from 'vitest';
import fs from '../../src/storages/fs';
import { stat, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';

vi.mock('fs/promises', () => ({
  stat: vi.fn(),
  mkdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  readdir: vi.fn()
}));

test('hasFile', async () => {
  (stat as Mock).mockResolvedValue({ isFile: vi.fn().mockReturnValue(true) });
  const res = await fs.hasFile('/foo/bar');
  expect(res).toBe(true);
});

test('hasDir', async () => {
  (stat as Mock).mockResolvedValue({ isDirectory: vi.fn().mockReturnValue(true) });
  const res = await fs.hasDir('/foo/bar');
  expect(res).toBe(true);
});

test('createDir', async () => {
  (mkdir as Mock).mockResolvedValue(undefined);
  const res = await fs.createDir('/foo/bar');
  expect(res).toBe(undefined);
});

test('readFile', async () => {
  (readFile as Mock).mockResolvedValue(undefined);
  const res = await fs.readFile('/foo/bar');
  expect(res).toBe(undefined);
});

test('writeFile', async () => {
  (writeFile as Mock).mockResolvedValue(undefined);
  const res = await fs.writeFile('../storage', Buffer.from('hello world'));
  expect(res).toBe(undefined);
});

test('ls', async () => {
  (readdir as Mock).mockResolvedValue(['/foo/bar']);
  const res = await fs.ls('../storage');
  expect(res).toEqual(['/foo/bar']);
});
