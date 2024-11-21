import axios from 'axios';
import { UPLOAD_PREFIX, HAS_FILE } from 'upload-file-server/const';
import type { FindFileResponse } from 'upload-file-server/types';

const fileAxiosInstance = axios.create({
  baseURL: '/api'
});

type fileParams = {
  hash: string;
  index?: number;
};

export const hasFile = async (params: fileParams) => {
  const res = await fileAxiosInstance.get<FindFileResponse>(`${UPLOAD_PREFIX}${HAS_FILE}`, {
    params
  });
  console.log(res)
  return res.data.data;
};

export const uploadChunk = async () => {

}

export const mergeChunkToFile = async () => {

}
