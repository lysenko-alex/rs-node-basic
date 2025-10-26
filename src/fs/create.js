import fs from 'node:fs/promises';
import { checkFileExists } from '../shared.js';

const FILE_NAME = 'fresh.txt';
const FILE_CONTENT = 'I am fresh and young';
const FILE_PATH = `./src/fs/files/${FILE_NAME}`;


const create = async () => {
  try {
    const fileExists = await checkFileExists(FILE_PATH);
    if (fileExists) {
      throw new Error('FS operation failed');
    }
    await fs.writeFile(FILE_PATH, FILE_CONTENT);
  } catch (error) {
    throw new Error(error);
  }
};

await create();