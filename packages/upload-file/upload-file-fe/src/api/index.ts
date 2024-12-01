import axios from 'axios';
import { UPLOAD_PREFIX, HAS_FILE, UPLOAD_CHUNK, MERGE_CHUNK } from 'upload-file-server/const';
import { type mergeChunkResponse, type FindFileResponse } from 'upload-file-server/types';

const fileAxiosInstance = axios.create({
  baseURL: '/api'
});

type fileParams = {
  hash: string;
  index?: number;
};

type uploadChunkParams = {
  hash: string;
  index: number;
  chunk: Blob;
};

type mergeFileParams = {
  hash: string;
};

export const hasFile = async (params: fileParams, signal: AbortSignal) => {
  const res = await fileAxiosInstance.get<FindFileResponse>(`${UPLOAD_PREFIX}${HAS_FILE}`, {
    params,
    signal
  });
  return res.data.data;
};

export const uploadChunk = async (params: uploadChunkParams, signal: AbortSignal) => {
  const { hash, index, chunk } = params;
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('hash', hash);
  formData.append('index', index + '');
  const res = await fileAxiosInstance.post<{ data: { code: number } }>(
    `${UPLOAD_PREFIX}${UPLOAD_CHUNK}`,
    formData,
    {
      signal
    }
  );
  return res.data.data;
};

export const mergeChunkToFile = async (params: mergeFileParams, signal: AbortSignal) => {
  const res = await fileAxiosInstance.post<mergeChunkResponse>(`${UPLOAD_PREFIX}${MERGE_CHUNK}`, params, {
    signal
  });
  return res.data.data;
};
