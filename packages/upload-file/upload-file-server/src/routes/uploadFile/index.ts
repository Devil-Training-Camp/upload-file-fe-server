
import { type Context } from 'koa'


export const hasFile = (ctx: Context) => {
  ctx.body = 'hello world';
}
export const uploadChunk = (ctx: Context) => {
  ctx.body = 'hello world1';
}
export const mergeChunk = (ctx: Context) => {
  ctx.body = 'hello world2';
}