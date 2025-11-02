import path from 'node:path';
import fs from 'node:fs/promises';
import { ERROR_MESSAGES } from './constants.js';

export function normalizePath(currentDir, pathArg) {
  if (!pathArg || typeof pathArg !== 'string') {
    return currentDir;
  }
  
  if (path.isAbsolute(pathArg)) {
    return path.normalize(pathArg);
  }
  
  return path.normalize(path.join(currentDir, pathArg));
}

export async function pathExists(pathArg) {
  try {
    await fs.access(pathArg);
    return true;
  } catch {
    return false;
  }
}

export async function safeOperation(operation) {
  try {
    const result = await operation();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message || ERROR_MESSAGES.OPERATION_FAILED };
  }
}

export function validateArgs(args, minArgs, maxArgs) {
  if (!Array.isArray(args)) {
    return false;
  }
  
  if (args.length < minArgs) {
    return false;
  }
  
  if (maxArgs !== undefined && args.length > maxArgs) {
    return false;
  }
  
  return true;
}

export function getRootDirectory(pathArg) {
  if (process.platform === 'win32') {
    const parsed = path.parse(pathArg);
    return parsed.root;
  } else {
    return '/';
  }
}

export function isRootDirectory(pathArg) {
  const root = getRootDirectory(pathArg);
  return path.normalize(pathArg) === path.normalize(root);
}
