import logger from '../logger.ts';

const partOne = (input: string[]) => {
  const ranges = input[0].split(',');
  const invalidIds = [];

  for (const range of ranges) {
    const [start, end] = range.split('-').map(num => parseInt(num));

    for (let currentId = start; currentId <= end; currentId++) {
      const currentIdString = `${currentId}`;

      // Odd length IDs can't be invalid
      if (currentIdString.length % 2 !== 0) {
        continue;
      }

      const leftSide = currentIdString.slice(0, currentIdString.length / 2);
      const rightSide = currentIdString.slice(currentIdString.length / 2, currentIdString.length);

      logger.log(`Checking ID ${currentId}`, { leftSide, rightSide });
      if (leftSide === rightSide) {
        logger.log(`Invalid ID ${currentId}`);
        invalidIds.push(currentId);
      }
    }
  }

  return invalidIds.reduce((count, currId) => count + currId, 0);
};

const partTwo = (input: string[]) => {};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 0 : 0);

export { solve, expected };
