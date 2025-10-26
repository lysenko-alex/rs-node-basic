const ENV_PREFIX = 'RSS_';

const parseEnv = () => {
  try {
    const env = process.env;
    const envKeys = Object.keys(env).filter(key => key.startsWith(ENV_PREFIX));
    const envValues = envKeys.map(key => `${key}=${env[key]}`);
    console.log(envValues.join('; '));
    if (envValues.length === 0) {
      console.log('No valid environment variables found');
    }
  } catch (error) {
    throw new Error(error);
  }
};

parseEnv();
