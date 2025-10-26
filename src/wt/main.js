import { Worker } from 'node:worker_threads';
import { cpus } from 'node:os';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const WORKER_PATH = join(dirname(fileURLToPath(import.meta.url)), 'worker.js');

const performCalculations = async () => {
  const numCores = cpus().length;
  const workers = Array.from({ length: numCores }).reduce((acc, _, i) => {
    const worker = new Worker(WORKER_PATH);
    const numberToSend = 10 + i;
    
    const workerPromise = new Promise((resolve) => {
      worker.on('message', (result) => {
        resolve({ status: 'resolved', data: result });
        worker.terminate();
      });
      
      worker.on('error', (error) => {
        resolve({ status: 'error', data: null });
        worker.terminate();
      });
      
      worker.on('exit', (code) => {
        if (code !== 0) {
          resolve({ status: 'error', data: null });
        }
      });
    });
    
    worker.postMessage({ n: numberToSend });
    
    acc.push(workerPromise);
    return acc;
  }, []);
  
  const allResults = await Promise.all(workers);
  
  console.log(allResults);
};

await performCalculations();
