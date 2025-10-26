const ARG_PREFIX = '--';

const formatArgs = ([key, value]) => `${key} is ${value}`;

const parseArgs = () => {
  try {
    const args = process.argv.slice(2);
    const parsedArgs = args.reduce((acc, arg, index) => {
      if (arg && arg.startsWith(ARG_PREFIX) && args[index + 1]) {
        const propName = arg.substring(ARG_PREFIX.length);
        const value = args[index + 1];
        acc[propName] = value;
      }
      return acc;
    }, {});
    
    const formattedOutput = Object.entries(parsedArgs).map(formatArgs).join(', ');
    
    console.log(formattedOutput);
  } catch (error) {
    throw new Error(error);
  }
};

parseArgs();
