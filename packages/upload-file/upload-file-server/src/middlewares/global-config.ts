import { type Context, type Middleware } from 'koa';

export default <T> (config: T): Middleware => {
  return async (ctx: Context, next: () => Promise<void>) => {
    ctx.getGlobalConfig = (): T => config;
    await next();
  }
}