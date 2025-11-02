import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import { normalizePath, pathExists } from './utils.js';
import { isValidFile, isValidDirectory } from './fileOperations.js';
import fsPromises from 'node:fs/promises';
import { ERROR_MESSAGES } from './constants.js';

export async function compressFile(currentDir, sourcePath, destPath) {
  const resolvedSourcePath = normalizePath(currentDir, sourcePath);
  const resolvedDestPath = normalizePath(currentDir, destPath);
  
  if (!(await isValidFile(resolvedSourcePath))) {
    throw new Error(ERROR_MESSAGES.SOURCE_FILE_NOT_FOUND);
  }
  
  let destFilePath;
  try {
    const destStats = await fsPromises.stat(resolvedDestPath);
    if (destStats.isDirectory()) {
      const sourceFileName = path.basename(resolvedSourcePath);
      destFilePath = path.join(resolvedDestPath, `${sourceFileName}.br`);
    } else {
      destFilePath = resolvedDestPath;
    }
  } catch {
    destFilePath = resolvedDestPath;
  }
  
  if (await pathExists(destFilePath)) {
    throw new Error(ERROR_MESSAGES.DESTINATION_FILE_EXISTS);
  }
  
  const destDir = path.dirname(destFilePath);
  try {
    await fsPromises.mkdir(destDir, { recursive: true });
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_CREATE_DEST_DIR}: ${error.message}`);
  }
  
  try {
    await createCompressPipeline(resolvedSourcePath, destFilePath);
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_COMPRESS}: ${error.message}`);
  }
}

export async function decompressFile(currentDir, sourcePath, destPath) {
  const resolvedSourcePath = normalizePath(currentDir, sourcePath);
  const resolvedDestPath = normalizePath(currentDir, destPath);
  
  if (!(await isValidFile(resolvedSourcePath))) {
    throw new Error(ERROR_MESSAGES.SOURCE_FILE_NOT_FOUND);
  }
  
  let destFilePath;
  try {
    const destStats = await fsPromises.stat(resolvedDestPath);
    if (destStats.isDirectory()) {
      const sourceFileName = path.basename(resolvedSourcePath);
      const baseName = sourceFileName.endsWith('.br') 
        ? sourceFileName.slice(0, -3) 
        : sourceFileName;
      destFilePath = path.join(resolvedDestPath, baseName);
    } else {
      destFilePath = resolvedDestPath;
    }
  } catch {
    destFilePath = resolvedDestPath;
  }
  
  if (await pathExists(destFilePath)) {
    throw new Error(ERROR_MESSAGES.DESTINATION_FILE_EXISTS);
  }
  
  const destDir = path.dirname(destFilePath);
  try {
    await fsPromises.mkdir(destDir, { recursive: true });
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_CREATE_DEST_DIR}: ${error.message}`);
  }
  
  try {
    await createDecompressPipeline(resolvedSourcePath, destFilePath);
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_DECOMPRESS}: ${error.message}`);
  }
}

async function createCompressPipeline(sourcePath, destPath) {
  await pipeline(
    createReadStream(sourcePath),
    createBrotliCompress(),
    createWriteStream(destPath)
  );
}

async function createDecompressPipeline(sourcePath, destPath) {
  await pipeline(
    createReadStream(sourcePath),
    createBrotliDecompress(),
    createWriteStream(destPath)
  );
}
