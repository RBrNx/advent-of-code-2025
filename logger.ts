/* eslint-disable @typescript-eslint/no-explicit-any */
import chalk from 'chalk';

export default {
  log: (message?: any, ...optionalParams: any[]) => {
    if (process.env.ENABLE_LOGS === 'true') {
      console.log(message, ...optionalParams);
    }
  },
  logGreen: (message?: any, ...optionalParams: any[]) => {
    if (process.env.ENABLE_LOGS === 'true') {
      console.log(chalk.green(message, ...optionalParams));
    }
  },
  logRed: (message?: any, ...optionalParams: any[]) => {
    if (process.env.ENABLE_LOGS === 'true') {
      console.log(chalk.red(message, ...optionalParams));
    }
  },
};
