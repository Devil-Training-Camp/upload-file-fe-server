import { type Context } from 'koa';
import { mergeChunkResponse } from '../../types';
import { FileChunkService } from 'file-storage';

const merge = async (root, hash) => {
  const fileService = new FileChunkService({ hash, storagePath: root });
  const res = await fileService.mergeFile();
  return {
    hash: '',
    count: 0
  };
};

export default async (ctx: Context) => {
  const { hash } = ctx.request.body;
  const { savePath } = ctx.getGlobalConfig();
  const res = await merge(savePath, hash);
  ctx.body = {
    code: 0,
    data: res
  } satisfies mergeChunkResponse;
};
