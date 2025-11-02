import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { normalizePath } from './utils.js';
import { isValidFile } from './fileOperations.js';
import { ERROR_MESSAGES } from './constants.js';

export async function calculateHash(currentDir, filePath) {
  const resolvedPath = normalizePath(currentDir, filePath);
  
  if (!(await isValidFile(resolvedPath))) {
    throw new Error(ERROR_MESSAGES.FILE_NOT_FOUND_OR_NOT_FILE);
  }
  
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(resolvedPath);
    
    stream.on('data', (chunk) => {
      hash.update(chunk);
    });
    
    stream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    
    stream.on('error', (error) => {
      reject(new Error(`${ERROR_MESSAGES.FAILED_TO_CALCULATE_HASH}: ${error.message}`));
    });
  });
}
