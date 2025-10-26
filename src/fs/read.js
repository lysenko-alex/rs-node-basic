import fs from 'node:fs/promises';
import { ERROR_MESSAGE, checkFileExists } from '../shared.js';

const FILE_PATH = './src/fs/files/fileToRead.txt';

const read = async () => {
  try {
    const fileExists = await checkFileExists(FILE_PATH);
    if (!fileExists) {
      throw new Error(ERROR_MESSAGE);
    }
    const fileContent = await fs.readFile(FILE_PATH, 'utf-8');
    console.log(fileContent);
  } catch (error) {
    console.error(error.message);
    throw new Error(ERROR_MESSAGE);
  }
};

await read();
