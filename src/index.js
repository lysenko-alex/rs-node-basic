import readline from 'node:readline';
import { homedir } from 'node:os';
import { goUp, changeDirectory, listDirectory } from './modules/navigation.js';
import * as fileOps from './modules/fileOperations.js';
import { handleOSCommand } from './modules/osInfo.js';
import { calculateHash } from './modules/hash.js';
import { compressFile, decompressFile } from './modules/compression.js';
import { validateArgs } from './modules/utils.js';
import { logger } from './modules/logger.js';
import { COMMANDS, ERROR_MESSAGES } from './modules/constants.js';

function getUsername() {
  const args = process.argv.slice(2);
  
  for (const arg of args) {
    if (arg.startsWith('--username=')) {
      const username = arg.split('=')[1];
      if (username && username.trim() !== '') {
        return username.trim();
      }
    }
  }
  
  throw new Error(ERROR_MESSAGES.USERNAME_REQUIRED);
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function displayCurrentDirectory(pathArg) {
  logger.directory(`You are currently in ${pathArg}`);
}

function parseCommand(input) {
  if (!input || typeof input !== 'string') {
    return { command: '', args: [] };
  }
  
  const trimmed = input.trim();
  if (trimmed === '') {
    return { command: '', args: [] };
  }
  
  const parts = trimmed.split(/\s+/);
  const command = parts[0];
  const args = parts.slice(1);
  
  return { command, args };
}

async function processCommand(input, currentDir) {
  const { command, args } = parseCommand(input);
  
  if (command === '') {
    return { error: ERROR_MESSAGES.INVALID_INPUT };
  }
  
  try {
    switch (command) {
      case COMMANDS.UP:
        if (!validateArgs(args, 0, 0)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        const newDirUp = await goUp(currentDir);
        return { newDir: newDirUp };
        
      case COMMANDS.CD:
        if (!validateArgs(args, 1, 1)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        const newDirCd = await changeDirectory(currentDir, args[0]);
        return { newDir: newDirCd };
        
      case COMMANDS.LS:
        if (!validateArgs(args, 0, 0)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        const listing = await listDirectory(currentDir);
        return { result: '' };
        
      case COMMANDS.CAT:
        if (!validateArgs(args, 1, 1)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        const content = await fileOps.readFile(currentDir, args[0]);
        return { result: content };
        
      case COMMANDS.ADD:
        if (!validateArgs(args, 1, 1)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await fileOps.createFile(currentDir, args[0]);
        return { result: '' };
        
      case COMMANDS.MKDIR:
        if (!validateArgs(args, 1, 1)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await fileOps.createDirectory(currentDir, args[0]);
        return { result: '' };
        
      case COMMANDS.RENAME:
        if (!validateArgs(args, 2, 2)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await fileOps.rename(currentDir, args[0], args[1]);
        return { result: '' };
        
      case COMMANDS.COPY:
        if (!validateArgs(args, 2, 2)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await fileOps.copyFile(currentDir, args[0], args[1]);
        return { result: '' };
        
      case COMMANDS.MOVE:
        if (!validateArgs(args, 2, 2)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await fileOps.moveFile(currentDir, args[0], args[1]);
        return { result: '' };
        
      case COMMANDS.DELETE:
        if (!validateArgs(args, 1, 1)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await fileOps.deleteFile(currentDir, args[0]);
        return { result: '' };
        
      case COMMANDS.OS:
        if (!validateArgs(args, 1, 1)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        const osResult = handleOSCommand(args[0]);
        logger.osInfo(osResult);
        return { result: '' };
        
      case COMMANDS.HASH:
        if (!validateArgs(args, 1, 1)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        const hashResult = await calculateHash(currentDir, args[0]);
        logger.hash(hashResult);
        return { result: '' };
        
      case COMMANDS.COMPRESS:
        if (!validateArgs(args, 2, 2)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await compressFile(currentDir, args[0], args[1]);
        return { result: '' };
        
      case COMMANDS.DECOMPRESS:
        if (!validateArgs(args, 2, 2)) {
          return { error: ERROR_MESSAGES.INVALID_INPUT };
        }
        await decompressFile(currentDir, args[0], args[1]);
        return { result: '' };
        
      case COMMANDS.EXIT:
        return { exit: true };
        
      default:
        return { error: ERROR_MESSAGES.INVALID_INPUT };
    }
  } catch (error) {
    return { error: ERROR_MESSAGES.OPERATION_FAILED };
  }
}

function handleExit(username) {
  logger.welcome(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
}

function main() {
  let username;
  try {
    username = getUsername();
  } catch (error) {
    logger.error(error.message);
    process.exit(1);
  }
  
  logger.welcome(`Welcome to the File Manager, ${username}!`);
  
  let currentDir = homedir();
  displayCurrentDirectory(currentDir);
  
  const rl = createReadlineInterface();
  
  rl.on('SIGINT', () => {
    handleExit(username);
  });
  
  rl.on('line', async (input) => {
    const { result, error, newDir, exit } = await processCommand(input, currentDir);
    
    if (exit) {
      rl.close();
      handleExit(username);
      return;
    }
    
    if (error) {
      logger.error(error);
    } else if (result !== undefined) {
      if (result !== '') {
        logger.output(result);
      }
    }
    
    if (newDir) {
      currentDir = newDir;
    }
    
    displayCurrentDirectory(currentDir);
  });
}

main();
