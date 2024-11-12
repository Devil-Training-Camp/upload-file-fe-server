import SparkMD5 from 'spark-md5';

type fileChunkList = Blob[];

export const calMD5 = async (chunkList: fileChunkList) => {
  const spark = new SparkMD5.ArrayBuffer();
  const fileReader = new FileReader();
  for (let i = 0; i < chunkList.length; i++) {
    const hash = await readChunkToHash(fileReader, chunkList[i]);
    spark.append(hash);
  }
  return spark.end();
}

const readChunkToHash = (fileReader: FileReader, chunk: Blob) => {
  return new Promise((resolve, reject) => {
    fileReader.readAsArrayBuffer(chunk);
    fileReader.onload = (e) => {
      const hash = e.target?.result;
      resolve(hash);
    };
    fileReader.onerror = () => {
      reject('Error reading chunk');
    }
  })
}