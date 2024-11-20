import { type Context } from 'koa';
import { FileChunkService } from 'file-storage';
import { FindFileResponse } from '../../types';

const searchFile = async (index, hash, savePath) => {
  const fService = new FileChunkService({
    hash,
    storagePath: savePath
  });
  const res = await fService.searchFile(index);
  return res;
};

export default async (ctx: Context) => {
  const { index, hash } = ctx.request.query;
  const { savePath } = ctx.getGlobalConfig();
  const isExist = await searchFile(index, hash, savePath);
  ctx.body = {
    code: 0,
    data: {
      isExist
    }
  } satisfies FindFileResponse;
};
