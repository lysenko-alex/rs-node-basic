import { createReadStream } from 'node:fs';
import crypto from 'node:crypto';

const FILE_PATH = './src/hash/files/fileToCalculateHashFor.txt';

const calculateHash = async () => {
  const readableStream = createReadStream(FILE_PATH);
  const hash = crypto.createHash('sha256');

  readableStream.on('data', (chunk) => {
    hash.update(chunk);
  });

  readableStream.on('end', () => {
    console.log(hash.digest('hex'));
  });
};

await calculateHash();
