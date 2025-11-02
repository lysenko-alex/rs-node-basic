import fs from 'node:fs/promises';
import path from 'node:path';
import { normalizePath, isRootDirectory } from './utils.js';

import { ERROR_MESSAGES } from './constants.js';

export async function goUp(currentDir) {
  if (isRootDirectory(currentDir)) {
    return currentDir;
  }
  
  const parentDir = path.dirname(currentDir);
  
  try {
    const stats = await fs.stat(parentDir);
    if (!stats.isDirectory()) {
      throw new Error(ERROR_MESSAGES.PARENT_NOT_DIRECTORY);
    }
    return parentDir;
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.CANNOT_ACCESS_PARENT}: ${error.message}`);
  }
}

export async function changeDirectory(currentDir, targetPath) {
  if (!targetPath || targetPath.trim() === '') {
    throw new Error(ERROR_MESSAGES.DIRECTORY_PATH_REQUIRED);
  }
  
  const resolvedPath = normalizePath(currentDir, targetPath);
  
  try {
    const stats = await fs.stat(resolvedPath);
    if (!stats.isDirectory()) {
      throw new Error(ERROR_MESSAGES.PATH_NOT_DIRECTORY);
    }
    return resolvedPath;
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.DIRECTORY_NOT_FOUND}: ${error.message}`);
  }
}

export async function listDirectory(currentDir) {
  try {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    return formatDirectoryListing(entries);
  } catch (error) {
    throw new Error(`${ERROR_MESSAGES.CANNOT_READ_DIRECTORY}: ${error.message}`);
  }
}

function formatDirectoryListing(entries) {
  const directories = [];
  const files = [];
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      directories.push({
        name: entry.name,
        type: 'directory'
      });
    } else {
      files.push({
        name: entry.name,
        type: 'file'
      });
    }
  }
  
  directories.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));
  
  const allEntries = [...directories, ...files];
  
  if (allEntries.length > 0) {
    console.table(allEntries);
  }
  
  return '';
}
