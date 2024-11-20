import { type Context } from 'koa';

export default (ctx: Context) => {
  ctx.body = 'uploadChunk';
}