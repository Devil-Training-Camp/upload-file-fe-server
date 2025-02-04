import SparkMD5 from 'spark-md5';
import type { piece } from './file';
self.onmessage = async (e: MessageEvent<{ chunkList: piece[] }>) => {
  const { chunkList } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  for (let i = 0; i < chunkList.length; i++) {
    const hash = await readChunkToHash(fileReader, chunkList[i]);
    spark.append(hash);
  }
  self.postMessage({
    hash: spark.end()
  });
  self.close();
};

const readChunkToHash = (fileReader: FileReader, chunk: piece) => {
  return new Promise((resolve, reject) => {
    fileReader.readAsArrayBuffer(chunk.chunk);
    fileReader.onload = (e) => {
      const hash = e.target?.result;
      resolve(hash);
    };
    fileReader.onerror = () => {
      reject('Error reading chunk');
    };
  });
};
