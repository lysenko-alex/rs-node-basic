import fs from 'node:fs/promises';
import { ERROR_MESSAGE, checkFileExists } from '../shared.js';

const FILES_PATH = './src/fs/files';
const FILES_COPY_PATH = './src/fs/files_copy';

const getFiles = async (path) => {
  try {
    const files = await fs.readdir(path, { withFileTypes: true });
    return files.filter(file => file.isFile());
  } catch (error) {
    console.log(error);
    return [];
  }
};

const copy = async () => {
  try {
    const files = await getFiles(FILES_PATH);
    const copyDirectoryExists = await checkFileExists(FILES_COPY_PATH);
                                        
    if (copyDirectoryExists) {
      throw new Error(ERROR_MESSAGE);
    }
    await fs.mkdir(FILES_COPY_PATH, { recursive: true })
            .catch(() => { throw new Error(ERROR_MESSAGE); });

    for (const file of files) {
      const filePath = `${FILES_PATH}/${file.name}`;
      const fileContent = await fs.readFile(filePath, 'utf-8');
      await fs.writeFile(`${FILES_COPY_PATH}/${file.name}`, fileContent);
    }

  } catch(error) {
    console.log(error);
    throw new Error(error);
  }
};

await copy();
