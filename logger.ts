export default {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  log: (message?: any, ...optionalParams: any[]) => {
    if (process.env.ENABLE_LOGS) {
      console.log(message, ...optionalParams);
    }
  },
};
