import { isString } from './utils/index';
import path from 'node:path';

export class FileChunkService {
  private __hash: string;
  private __storagePath: string;
  private __storage: {};

  constructor(options: { hash: string; storagePath: string; storage: {} }) {
    const { hash, storagePath, storage } = options;
    if (!isString(hash) || !isString(storagePath)) {
      throw 'hash or storagePath must be a string and it should not be empty string.';
    }
    this.__hash = hash;
    this.__storagePath = storagePath;
    this.__storage = storage;
  }

  get hashDir(): string {
    return path.resolve(this.__storagePath, this.__hash);
  }
}
