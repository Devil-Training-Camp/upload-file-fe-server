import { isString } from './utils/index';
import path from 'node:path';
import fileStorage from './storages/fs'
import Storage from './storages/storage';

const COMBINE_FILE = 'combine'

export class FileChunkService {
  private __hash: string;
  private __storagePath: string;
  private __storage: Storage;

  constructor(options: { hash: string; storagePath: string; storage?: Storage }) {
    const { hash, storagePath, storage } = options;
    if (!isString(hash) || !isString(storagePath)) {
      throw 'hash or storagePath must be a string and it should not be empty string.';
    }
    this.__hash = hash;
    this.__storagePath = storagePath;
    this.__storage = storage || fileStorage;
  }

  get hashDir(): string {
    return path.resolve(this.__storagePath, this.__hash);
  }

  searchFile(index?: number) {
    return this.__storage.hasFile(path.resolve(this.hashDir, index ? `${index}` : COMBINE_FILE));
  }
}
