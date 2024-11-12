
import { CHUNK_SIZE } from '@/const';

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