import Router from '@koa/router';
import { HAS_FILE, MERGE_CHUNK, UPLOAD_CHUNK, UPLOAD_PREFIX } from '../const';
import { hasFile, mergeChunk, uploadChunk } from './uploadFile';
import koaBody from 'koa-body';

export const defineRoutes = () => {
  const router = new Router({
    prefix: UPLOAD_PREFIX
  });
  router.get(HAS_FILE, hasFile);
  router.post(UPLOAD_CHUNK, koaBody({ multipart: true }), uploadChunk);
  router.post(MERGE_CHUNK, koaBody(), mergeChunk);

  return router;
};
