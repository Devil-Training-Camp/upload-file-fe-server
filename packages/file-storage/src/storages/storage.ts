export default abstract class Storage {
  abstract hasFile(path: string): Promise<boolean>;

  abstract hasDir(path: string): Promise<boolean>;

  abstract createDir(path: string): Promise<void>;

  abstract readFile(path: string): Promise<Buffer>;

  abstract writeFile(path: string, value: Buffer): Promise<void>;

  abstract ls(dirPath: string): Promise<string[]>;

  async mergeFile(pathList: string[], savePath: string) {
    const contentList = await Promise.all(pathList.map((path) => this.readFile(path)));
    const buffer = Buffer.concat(contentList);
    await this.writeFile(savePath, buffer);
  }
}
