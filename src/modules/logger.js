const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  brightGreen: '\x1b[92m',
  brightCyan: '\x1b[96m',
  brightMagenta: '\x1b[95m',
};

function colorize(text, colorCode) {
  return `${colorCode}${text}${colors.reset}`;
}

export const logger = {
  error(message) {
    console.log(colorize(message, colors.red));
  },

  welcome(message) {
    console.log(colorize(message, colors.brightGreen));
  },

  directory(message) {
    console.log(colorize(message, colors.brightCyan));
  },

  log(message) {
    console.log(message);
  },

  hash(hash) {
    console.log(colorize(hash, colors.brightMagenta));
  },

  osInfo(info) {
    console.log(colorize(info, colors.brightCyan));
  },
};
