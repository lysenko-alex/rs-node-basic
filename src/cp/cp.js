import { spawn } from 'node:child_process';

const SCRIPT_PATH = './src/cp/files/script.js';

const spawnChildProcess = async (args) => {
  const childProcess = spawn('node', [SCRIPT_PATH, ...args], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  process.stdin.pipe(childProcess.stdin);  
  childProcess.stdout.pipe(process.stdout);

  childProcess.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  childProcess.on('error', (error) => {
    console.error('Child process error:', error);
  });

  return childProcess;
};

// Put your arguments in function call to test this functionality
spawnChildProcess(['arg1', 'arg2', 'arg3']);
