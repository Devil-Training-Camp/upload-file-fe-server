import { type Context, type Middleware } from 'koa';
import { HttpError } from '../utils/http-error';

export default (): Middleware => {
  return async (ctx: Context, next: () => Promise<void>) => {
    try {
      await next();
    } catch (error) {
      const code = error instanceof HttpError ? error.code : 500
      ctx.status = code;
      ctx.body = {
        code,
        message: error.message + '\n' + error.stack
      }
    }
  };
};
