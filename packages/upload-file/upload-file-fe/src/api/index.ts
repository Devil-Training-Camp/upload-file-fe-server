import axios from 'axios'

const fileAxiosInstance = axios.create({
  baseURL: '/'
});

const hasFilePath = '/hasFile';

export const hasFile = async () => {
  const res = await fileAxiosInstance.get(hasFilePath);
  return res;
}