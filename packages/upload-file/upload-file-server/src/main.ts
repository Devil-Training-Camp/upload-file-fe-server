import path from 'node:path';
import app from './app';

async function main () {
  const PORT = 3000;
  const savePath = path.resolve(__dirname, '../node_modules/.cache');
  await app(PORT, {
    savePath
  });
  console.log(`start server http://localhost:${PORT}`);
}

main();

