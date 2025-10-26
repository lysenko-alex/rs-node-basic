import fs from 'node:fs/promises';
import { ERROR_MESSAGE, checkFileExists } from '../shared.js';

const DIRECTORY_PATH = './src/fs/files';

const list = async () => {
  try {
    const directoryExists = await checkFileExists(DIRECTORY_PATH);
    if (!directoryExists) {
      throw new Error(ERROR_MESSAGE);
    }
    const fileNames = await fs.readdir(DIRECTORY_PATH);
    console.log(fileNames);
  } catch (error) {
    throw new Error(error);
  }
};

await list();
