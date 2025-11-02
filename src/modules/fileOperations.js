import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { normalizePath } from './utils.js';
import { pipeline } from 'node:stream/promises';
import { ERROR_MESSAGES } from './constants.js';

export async function readFile(currentDir, filePath) {
  const resolvedPath = normalizePath(currentDir, filePath);
  
  if (!(await isValidFile(resolvedPath))) {
    throw new Error(ERROR_MESSAGES.FILE_NOT_FOUND_OR_NOT_FILE);
  }
  
  return new Promise((resolve, reject) => {
    const chunks = [];
    const stream = createReadStream(resolvedPath, { encoding: 'utf8' });
    
    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    stream.on('end', () => {
      resolve(chunks.join(''));
    });
    
    stream.on('error', (error) => {
      reject(new Error(`${ERROR_MESSAGES.FAILED_TO_READ_FILE}: ${error.message}`));
    });
  });
}

export async function createFile(currentDir, fileName) {
  if (!fileName || fileName.trim() === '') {
    throw new Error(ERROR_MESSAGES.FILE_NAME_REQUIRED);
  }
  
  const filePath = path.join(currentDir, fileName);
  
  if (await pathExists(filePath)) {
    throw new Error(ERROR_MESSAGES.FILE_ALREADY_EXISTS);
  }
  
  try {
    await fsPromises.writeFile(filePath, '', 'utf8');
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_CREATE_FILE}: ${error.message}`);
  }
}

export async function createDirectory(currentDir, dirName) {
  if (!dirName || dirName.trim() === '') {
    throw new Error(ERROR_MESSAGES.DIRECTORY_NAME_REQUIRED);
  }
  
  const dirPath = path.join(currentDir, dirName);
  
  if (await pathExists(dirPath)) {
    throw new Error(ERROR_MESSAGES.DIRECTORY_ALREADY_EXISTS);
  }
  
  try {
    await fsPromises.mkdir(dirPath);
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_CREATE_DIRECTORY}: ${error.message}`);
  }
}

export async function rename(currentDir, oldPath, newName) {
  if (!newName || newName.trim() === '') {
    throw new Error(ERROR_MESSAGES.NEW_NAME_REQUIRED);
  }
  
  const resolvedOldPath = normalizePath(currentDir, oldPath);
  const newPath = path.join(path.dirname(resolvedOldPath), newName);
  
  if (!(await pathExists(resolvedOldPath))) {
    throw new Error(ERROR_MESSAGES.SOURCE_NOT_FOUND);
  }
  
  if (await pathExists(newPath)) {
    throw new Error(ERROR_MESSAGES.DESTINATION_EXISTS);
  }
  
  try {
    await fsPromises.rename(resolvedOldPath, newPath);
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_RENAME}: ${error.message}`);
  }
}

export async function copyFile(currentDir, sourcePath, destPath) {
  const resolvedSourcePath = normalizePath(currentDir, sourcePath);
  const resolvedDestPath = normalizePath(currentDir, destPath);
  
  if (!(await isValidFile(resolvedSourcePath))) {
    throw new Error(ERROR_MESSAGES.SOURCE_FILE_NOT_FOUND);
  }
  
  if (!(await isValidDirectory(resolvedDestPath))) {
    throw new Error(ERROR_MESSAGES.DESTINATION_DIRECTORY_NOT_FOUND);
  }
  
  const sourceFileName = path.basename(resolvedSourcePath);
  const destFilePath = path.join(resolvedDestPath, sourceFileName);
  
  if (path.resolve(resolvedSourcePath) === path.resolve(destFilePath)) {
    throw new Error(ERROR_MESSAGES.CANNOT_COPY_TO_SELF);
  }
  
  if (await pathExists(destFilePath)) {
    throw new Error(ERROR_MESSAGES.DESTINATION_FILE_EXISTS);
  }
  
  try {
    await pipeline(
      createReadStream(resolvedSourcePath),
      createWriteStream(destFilePath)
    );
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_COPY}: ${error.message}`);
  }
}

export async function moveFile(currentDir, sourcePath, destPath) {
  await copyFile(currentDir, sourcePath, destPath);
  
  const resolvedSourcePath = normalizePath(currentDir, sourcePath);
  try {
    await fsPromises.unlink(resolvedSourcePath);
  } catch (error) {
    const resolvedDestPath = normalizePath(currentDir, destPath);
    const sourceFileName = path.basename(resolvedSourcePath);
    const destFilePath = path.join(resolvedDestPath, sourceFileName);
    try {
      await fsPromises.unlink(destFilePath);
    } catch {
    }
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_MOVE}: ${error.message}`);
  }
}

export async function deleteFile(currentDir, filePath) {
  const resolvedPath = normalizePath(currentDir, filePath);
  
  if (!(await isValidFile(resolvedPath))) {
    throw new Error(ERROR_MESSAGES.FILE_NOT_FOUND);
  }
  
  try {
    await fsPromises.unlink(resolvedPath);
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.FAILED_TO_DELETE}: ${error.message}`);
  }
}

export async function isValidFile(pathArg) {
  try {
    const stats = await fsPromises.stat(pathArg);
    return stats.isFile();
  } catch {
    return false;
  }
}

export async function isValidDirectory(pathArg) {
  try {
    const stats = await fsPromises.stat(pathArg);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

async function pathExists(pathArg) {
  try {
    await fsPromises.access(pathArg);
    return true;
  } catch {
    return false;
  }
}
