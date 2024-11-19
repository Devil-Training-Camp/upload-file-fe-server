import Koa from 'koa';
import { defineRoutes } from './routes/index'
const app = new Koa();
const router = defineRoutes();

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
