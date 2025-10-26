import { createReadStream } from 'node:fs';
import { createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const FILE_PATH = './src/zip/files/fileToCompress.txt';
const ZIP_FILE_PATH = './src/zip/files/archive.gz';

const compress = async () => {
  const readStream = createReadStream(FILE_PATH);
  const writeStream = createWriteStream(ZIP_FILE_PATH);
  const gzip = createGzip();
  pipeline(
    readStream, 
    gzip, 
    writeStream
  );
};

await compress();
