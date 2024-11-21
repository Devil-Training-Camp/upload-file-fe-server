import { CHUNK_SIZE } from '@/const';
import requestLimit, { type limitFunction } from './requestLimit';
import { hasFile, uploadChunk } from '@/api';

export interface piece {
  chunk: Blob;
  index: number;
}

export const splitFile = (file: File, chunkSize = CHUNK_SIZE) => {
  const chunkList = [];
  let curSize = 0;
  let index = -1;
  while (curSize < file.size) {
    const chunk = file.slice(curSize, curSize + chunkSize);
    chunkList.push({
      chunk,
      index: ++index
    });
    curSize += CHUNK_SIZE;
  }
  return chunkList;
};

export const uploadChunkList = async (params: {
  chunkList: piece[];
  fileHash: string;
  onTick: (progress: number) => void;
}) => {
  const { chunkList, fileHash, onTick } = params;
  const limit = requestLimit(3);
  const res = await upload({ len: chunkList.length, successLen: 0, chunkList, limit, fileHash, onTick });
  return res;
};

const upload = async (
  options: {
    len: number;
    successLen: number;
    chunkList: piece[];
    limit: limitFunction;
    fileHash: string;
    onTick: (progress: number) => void;
  },
  curRetryCount: number = 0,
  totalRetryCount: number = 0
) => {
  let { len, successLen, chunkList, limit, fileHash, onTick } = options;
  if (totalRetryCount <= curRetryCount) {
    return false;
  }
  const requestList = [];
  const failList: piece[] = [];
  for (let i = 0; i < chunkList.length; i++) {
    const chunk = chunkList[i];
    requestList.push(
      limit(() =>
        new Promise(async (resolve, reject) => {
          try {
            const { isExist } = await hasFile({
              hash: fileHash,
              index: chunk.index
            });
            if (isExist) {
              resolve('OK');
            } else {
              await uploadChunk();
              resolve(chunk);
            }
          } catch (error) {
            reject(error);
          }
        })
          .then(() => {
            successLen++;
            onTick((successLen / len) * 100);
          })
          .catch(() => {
            failList.push(chunk);
          })
      )
    );
  }
  await Promise.allSettled(requestList);
  if (failList.length > 0) {
    return await upload(
      { len, successLen, chunkList: failList, limit, fileHash, onTick },
      ++curRetryCount,
      totalRetryCount
    );
  }
  return true;
};
