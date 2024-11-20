import Koa from 'koa';
import { defineRoutes } from './routes/index';
import globalErrorCatch from './middlewares/global-error-catch';
import globalConfig from './middlewares/global-config';
const app = new Koa();
const router = defineRoutes();

interface uploadFileRoot {
  savePath: string;
}

export default (port: number, config: uploadFileRoot) => {
  return new Promise((resolve, reject) => {
    app.use(globalErrorCatch());

    app.use(globalConfig<uploadFileRoot>(config));

    app.use(router.routes()).use(router.allowedMethods());

    try {
      app.listen(port, () => {
        resolve({
          port
        });
      });
    } catch (error) {
      reject(error);
    }
  });
};
