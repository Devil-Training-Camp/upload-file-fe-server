import { CHUNK_SIZE } from '@/const';
import requestLimit, { type limitFunction } from './requestLimit';
import { hasFile, uploadChunk } from '@/api';
import { useUploadFileStore } from '@/stores/counter';
import piniaInstance from '@/stores';

const uploadFileStore = useUploadFileStore(piniaInstance);

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
  signal: AbortSignal;
}) => {
  const { chunkList, fileHash, onTick, signal } = params;
  const limit = requestLimit(3);
  const res = await upload({
    len: chunkList.length,
    successLen: 0,
    chunkList,
    limit,
    fileHash,
    onTick,
    signal
  });
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
    signal: AbortSignal;
  },
  curRetryCount: number = 0,
  totalRetryCount: number = 0
) => {
  let { len, successLen, chunkList, limit, fileHash, onTick, signal } = options;
  if (totalRetryCount < curRetryCount || !uploadFileStore.isUploading) {
    return false;
  }
  const requestList: Promise<void>[] = [];
  const failList: piece[] = [];
  let curQueueReject: (reason?: any) => void;
  for (let i = 0; i < chunkList.length; i++) {
    const chunk = chunkList[i];
    requestList.push(
      limit(() =>
        new Promise(async (resolve, reject) => {
          try {
            const { isExist } = await hasFile(
              {
                hash: fileHash,
                index: chunk.index
              },
              signal
            );
            console.log(isExist, '1111111');
            if (isExist) {
              resolve('OK');
            } else {
              await uploadChunk(
                {
                  hash: fileHash,
                  index: chunk.index,
                  chunk: chunk.chunk
                },
                signal
              );
              resolve('OK');
            }
          } catch (error) {
            console.log('uploadFileStore.isUploading ', uploadFileStore.isUploading);
            if (!uploadFileStore.isUploading) {
              curQueueReject();
              limit.cancelRequest();
            }
            reject(error);
          }
        })
          .then(() => {
            successLen++;
            onTick(Math.floor((successLen / len) * 100));
          })
          .catch(() => {
            failList.push(chunk);
          })
      )
    );
  }
  try {
    await new Promise(async (resolve, reject) => {
      curQueueReject = reject;
      await Promise.allSettled(requestList);
      resolve('ok');
    });
  } catch (error) {
    return false;
  }
  if (failList.length > 0) {
    return await upload(
      { len, successLen, chunkList: failList, limit, fileHash, onTick, signal },
      ++curRetryCount,
      totalRetryCount
    );
  }
  return true;
};
