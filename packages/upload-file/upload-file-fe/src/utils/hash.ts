import type { piece } from './file';
import hashWorker from './hashWorker.ts?worker';

export const calMD5 = async (chunkList: piece[]) => {
  const worker = new hashWorker();
  worker.postMessage({
    chunkList
  });
  return new Promise((resolve) => {
    worker.onmessage = (e) => {
      resolve(e.data.hash);
    };
  });
};
