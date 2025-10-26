import fs from 'node:fs/promises';

export const ERROR_MESSAGE = 'FS operation failed';

export const checkFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};