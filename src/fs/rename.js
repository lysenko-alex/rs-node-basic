import fs from 'node:fs/promises';
import { checkFileExists, ERROR_MESSAGE } from '../shared.js';

const FILE_PATH = './src/fs/files/wrongFilename.txt';
const NEW_FILE_PATH = './src/fs/files/properFilename.md';

const rename = async () => {
  try {
    const wrongFilenameExists = await checkFileExists(FILE_PATH);
    const properFilenameExists = await checkFileExists(NEW_FILE_PATH);

    if (!wrongFilenameExists || properFilenameExists) {
      throw new Error(ERROR_MESSAGE);
    }
    await fs.rename(FILE_PATH, NEW_FILE_PATH);
  } catch (error) {
    console.log(error.message);
    throw new Error(ERROR_MESSAGE);
  }
};

await rename();