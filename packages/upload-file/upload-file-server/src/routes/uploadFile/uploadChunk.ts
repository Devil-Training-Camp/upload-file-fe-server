import { type Context } from 'koa';
import { readFile } from 'node:fs/promises';
import { FileChunkService } from 'file-storage';
import { uploadChunkResponse } from '../../types';

export default async (ctx: Context) => {
  const { hash, index } = ctx.request.body;
  console.log(ctx.request.body);
  // @ts-ignore
  const chunkPath = ctx.request.files.chunk.filepath;
  const buffer = await readFile(chunkPath);
  const pieceService = new FileChunkService({ hash, storagePath: ctx.getGlobalConfig().savePath });
  await pieceService.writeFile(index, buffer);
  ctx.body = {
    code: 0,
    data: {
      hash,
      index
    }
  } satisfies uploadChunkResponse;
};
