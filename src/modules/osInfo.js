import os from 'node:os';
import { OS_FLAGS, ERROR_MESSAGES } from './constants.js';

export function getEOL() {
  const eol = os.EOL;
  const eolDisplay = JSON.stringify(eol);
  return eolDisplay;
}

export function getCPUs() {
  const cpus = os.cpus();
  const lines = [`Overall amount of CPUS: ${cpus.length}`];
  
  for (const cpu of cpus) {
    const clockRate = formatClockRate(cpu.speed);
    lines.push(`${cpu.model} - ${clockRate} GHz`);
  }
  
  return lines.join('\n');
}

export function getHomeDir() {
  return os.homedir();
}

export function getSystemUsername() {
  return os.userInfo().username;
}

export function getArchitecture() {
  return os.arch();
}

export function handleOSCommand(flag) {
  switch (flag) {
    case OS_FLAGS.EOL:
      return getEOL();
    case OS_FLAGS.CPUS:
      return getCPUs();
    case OS_FLAGS.HOMEDIR:
      return getHomeDir();
    case OS_FLAGS.USERNAME:
      return getSystemUsername();
    case OS_FLAGS.ARCHITECTURE:
      return getArchitecture();
    default:
      throw new Error(`${ERROR_MESSAGES.INVALID_OS_FLAG}: ${flag}`);
  }
}

function formatClockRate(speedHz) {
  return (speedHz / 1000).toFixed(2);
}
