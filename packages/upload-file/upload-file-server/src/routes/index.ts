import Router from '@koa/router';
import { HAS_FILE, MERGE_CHUNK, UPLOAD_CHUNK, UPLOAD_PREFIX } from '../const';
import { hasFile, mergeChunk, uploadChunk } from './uploadFile';

export const defineRoutes = () => {
  const router = new Router({
    prefix: UPLOAD_PREFIX
  });
  router.get(HAS_FILE, hasFile);
  router.get(UPLOAD_CHUNK, uploadChunk);
  router.get(MERGE_CHUNK, mergeChunk);

  return router;
};
