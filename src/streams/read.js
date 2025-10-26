import { createReadStream } from 'node:fs';

const FILE_PATH = './src/streams/files/fileToRead.txt';

const read = async () => {
  const readStream = createReadStream(FILE_PATH, { encoding: 'utf8' });
  
  readStream.pipe(process.stdout);
  
  readStream.on('error', (error) => {
    console.error('Error reading file:', error.message);
    process.exit(1);
  });
};

await read();
