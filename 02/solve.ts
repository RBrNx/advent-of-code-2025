import logger from '../logger.ts';

// Get all divisors of a number, excluding itself
const getDivisors = (num: number): number[] => {
  const divisors = [...Array(num)].map((x, i) => i).filter(x => num % x === 0);

  return divisors;
};

// Split a string into chunks of a given size
const splitStringIntoChunks = (str: string, chunkSize: number): string[] => {
  const numChunks = Math.ceil(str.length / chunkSize);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += chunkSize) {
    chunks[i] = str.substring(o, o + chunkSize);
  }

  return chunks;
};

const partOne = (input: string[]) => {
  const ranges = input[0].split(',');
  const invalidIds = [];

  for (const range of ranges) {
    const [start, end] = range.split('-').map(num => parseInt(num));

    // Check each ID in the range for invalidity
    for (let currentId = start; currentId <= end; currentId++) {
      const currentIdString = `${currentId}`;

      // Odd length IDs can't be invalid (yet), so lets skip them
      if (currentIdString.length % 2 !== 0) {
        continue;
      }

      // Split ID into two halves and compare them
      const [leftSide, rightSide] = splitStringIntoChunks(currentIdString, currentIdString.length / 2);

      logger.log(`Checking ID ${currentId}`, { leftSide, rightSide });
      if (leftSide === rightSide) {
        logger.log(`Invalid ID ${currentId}`);
        invalidIds.push(currentId);
      }
    }
  }

  return invalidIds.reduce((count, currId) => count + currId, 0);
};

const partTwo = (input: string[]) => {
  const ranges = input[0].split(',');
  const invalidIds = [];

  for (const range of ranges) {
    const [start, end] = range.split('-').map(num => parseInt(num));

    // Check each ID in the range for invalidity
    for (let currentId = start; currentId <= end; currentId++) {
      const currentIdString = `${currentId}`;

      // This time odd length IDs can also be invalid, so we get all divisors first
      const divisors = getDivisors(currentIdString.length);

      // Then we split the ID into chunks of each divisor size and check for equality across all chunks
      for (const divisor of divisors) {
        const chunks = splitStringIntoChunks(currentIdString, divisor);

        if (chunks.every(chunk => chunk === chunks[0])) {
          logger.log(`Invalid ID ${currentId}`, { chunks });
          invalidIds.push(currentId);
          break;
        }
      }
    }
  }

  return invalidIds.reduce((count, currId) => count + currId, 0);
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 30608905813 : 31898925685);

export { solve, expected };
