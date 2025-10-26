import { createWriteStream } from 'node:fs';

const FILE_PATH = './src/streams/files/fileToWrite.txt';

const write = async () => {
  const writeStream = createWriteStream(FILE_PATH, { encoding: 'utf8' });

  process.stdin.pipe(writeStream);
  
  writeStream.on('error', (error) => {
    console.error('Error writing file:', error.message);
    process.exit(1);
  });
  
  writeStream.on('finish', () => {
    console.log('Data written to file successfully');
  });
};

await write();
