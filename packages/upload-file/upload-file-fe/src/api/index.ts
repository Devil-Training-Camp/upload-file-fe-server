import axios from 'axios';

const fileAxiosInstance = axios.create({
  baseURL: '/'
});

const hasFilePath = '/hasFile';
type hasFileRes = {
  code: number;
  exist: boolean;
};

type fileParams = {
  hash: string;
  index?: number;
};

export const hasFile = async (params: fileParams) => {
  // let res = await fileAxiosInstance.get<hasFileRes>(hasFilePath, {
  //   params
  // });
  const res = {
    data: {
      code: 200,
      exist: false
    }
  }
  return res;
};

export const uploadChunk = async () => {

}

export const mergeChunkToFile = async () => {

}
