/* eslint-disable @typescript-eslint/no-explicit-any */
type requestFunc<ReturnType> = () => PromiseLike<ReturnType> | ReturnType;

export type limitFunction = {
  <ReturnType>(function_: requestFunc<ReturnType>): Promise<ReturnType>;
  cancelRequest: () => void;
};

export default function requestLimit(concurrency: number) {
  if (!validateConcurrency(concurrency)) {
    throw 'concurrency must be a number';
  }
  let requestPool: requestFunc<unknown>[] = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;
    if (requestPool.length > 0) {
      requestPool.shift()!();
    }
  };

  const run = async (func: requestFunc<unknown>, resolve: any, reject: any) => {
    activeCount++;
    console.log('run');
    try {
      const result = await func();
      console.log('result')
      resolve(result);
    } catch (error) {
      console.log('catch')
      reject(error);
    }
    next();
  };

  const enqueue = (func: requestFunc<unknown>, resolve: any, reject: any) => {
    requestPool.push(run.bind(null, func, resolve, reject));
    if (activeCount < concurrency && requestPool.length > 0) {
      requestPool.shift()!();
    }
  };

  const request: limitFunction = (func) => {
    return new Promise((resolve, reject) => {
      enqueue(func, resolve, reject);
    });
  };
  request.cancelRequest = () => {
    requestPool = [];
  };
  Object.defineProperties(request, {
    cancelRequest: {
      configurable: false,
      writable: false
    }
  });

  return request;
}

const validateConcurrency = (concurrency: number) => {
  return Number.isInteger(concurrency);
};
