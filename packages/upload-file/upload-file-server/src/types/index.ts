export interface Response<T> {
  code: number,
  message?: string,
  data: T
}

export type FindFileResponse = Response<{
  isExist: boolean
}>

export type uploadChunkResponse = Response<{
  hash: string,
  index: number
}>

export type mergeChunkResponse = Response<{
  hash: string,
  count: number
}>