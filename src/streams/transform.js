import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';


const transform = async () => {
  const reverseTransform = new Transform({
    transform(chunk, _, callback) {
      this.push(chunk.toString().split('').reverse().join('') + '\n');
      callback();
    }
  });

  pipeline(
    process.stdin,
    reverseTransform,
    process.stdout
  );
};

await transform();
