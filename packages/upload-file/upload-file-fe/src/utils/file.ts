
import { CHUNK_SIZE } from '@/const';
import requestLimit from './requestLimit';
import { hasFile, uploadChunk } from '@/api';

export const splitFile = (file: File, chunkSize = CHUNK_SIZE) => {
  const chunkList = [];
  let curSize = 0;
  while (curSize < file.size) {
    const chunk = file.slice(curSize, curSize + chunkSize);
    chunkList.push(chunk);
    curSize += CHUNK_SIZE;
  }
  return chunkList;
}

export const uploadChunkList = async (params: {
  chunkList: Blob[],
  fileHash: string,
  onTick: (progress: number) => void
}) => {
  console.log(params);
  const { chunkList, fileHash, onTick } = params;
  const limit = requestLimit(3);
  let successLen = 0;
  const total = chunkList.length;
  const requestList = [];
  for (const chunk of chunkList) {
    requestList.push(limit(() => new Promise((resolve, reject) => {
      setTimeout(async () => {
        await hasFile({
          hash: fileHash,
          index: 1
        });
        await uploadChunk();
        resolve(chunk);
      }, 1000);
    }).then(() => {
      successLen++;
      onTick(successLen / total * 100);
    })))
  }
  try {
    await Promise.all(requestList);
    return true;
  } catch {
    return false;
  }
}