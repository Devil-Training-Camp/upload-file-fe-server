import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import Storage from './storage';

class FileSystemStorage extends Storage {
  async hasFile(path: string): Promise<boolean> {
    try {
      const fileStat = await stat(path);
      return fileStat.isFile();
    } catch (error) {
      return false;
    }
  }

  async hasDir(path: string): Promise<boolean> {
    try {
      const fileStat = await stat(path);
      return fileStat.isDirectory();
    } catch (error) {
      return false;
    }
  }

  async createDir(path: string): Promise<void> {
    await mkdir(path, { recursive: true });
  }

  readFile(path: string): Promise<Buffer> {
    return readFile(path);
  }

  async writeFile(path: string, value: Buffer): Promise<void> {
    return await writeFile(path, value);
  }

  async ls(dirPath: string) {
    if (await this.hasDir(dirPath)) {
      const res = await readdir(dirPath);
      return res.map((item) => path.resolve(dirPath, item));
    } else {
      throw 'path is not a directory';
    }
  }
}

export default new FileSystemStorage();
