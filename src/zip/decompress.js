import { createReadStream } from 'node:fs';
import { createWriteStream } from 'node:fs';
import { createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

const ZIP_FILE_PATH = './src/zip/files/archive.gz';
const FILE_PATH = './src/zip/files/fileToCompress.txt';

const decompress = async () => {
  const readStream = createReadStream(ZIP_FILE_PATH);
  const writeStream = createWriteStream(FILE_PATH);
  const gunzip = createGunzip();
  pipeline(
    readStream,
    gunzip,
    writeStream
    );
};

await decompress();
