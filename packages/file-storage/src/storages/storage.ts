export default abstract class Storage {
  abstract hasFile(path: string): Promise<boolean>;

  abstract hasDir(path: string): Promise<boolean>;

  abstract createDir(path: string): Promise<void>;

  abstract readFile(path: string): Promise<Buffer>;

  abstract writeFile(path: string, value: Buffer): Promise<void>;

  abstract ls(dirPath: string): Promise<string[]>;
}