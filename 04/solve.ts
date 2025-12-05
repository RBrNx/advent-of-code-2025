import logger from '../logger.ts';

const countRollsInAdjacentSqaures = (grid: string[][], row: number, col: number) => {
  let count = 0;

  logger.log(`Checking adjacent squares for rolls around (${row}, ${col})`);

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dRow, dCol] of directions) {
    const rowToCheck = row + dRow;
    const colToCheck = col + dCol;

    // Check for out of bounds values, these should be skipped
    if (rowToCheck < 0 || rowToCheck > grid.length - 1 || colToCheck < 0 || colToCheck > grid[rowToCheck].length - 1) {
      continue;
    } else {
      if (grid[rowToCheck][colToCheck] === '@') {
        logger.logGreen(`-- Found roll at (${rowToCheck}, ${colToCheck})`);
        count++;
      }
    }
  }

  return count;
};

const partOne = (input: string[]) => {
  const grid = [];
  let accesibleRolls = 0;

  for (const line of input) {
    grid.push(line.split(''));
  }

  // Check each position in the grid to see if it's a roll and is accessible
  for (let row = 0; row <= grid.length - 1; row++) {
    for (let col = 0; col <= grid[row].length - 1; col++) {
      const currentPos = grid[row][col];

      // Current position is not a roll, skip it
      if (currentPos !== '@') {
        continue;
      } else {
        const rollsAdjacent = countRollsInAdjacentSqaures(grid, row, col);

        // A roll is accessible if it has less than 4 adjacent rolls
        if (rollsAdjacent < 4) {
          logger.logGreen(`!! Roll at (${row}, ${col}) is accessible with ${rollsAdjacent} adjacent rolls`);
          accesibleRolls++;
        } else {
          logger.logRed(`XX Roll at (${row}, ${col}) is NOT accessible with ${rollsAdjacent} adjacent rolls`);
        }
      }
    }
  }

  return accesibleRolls;
};

const partTwo = (input: string[]) => {
  let grid = [];
  let removedRolls = 0;

  for (const line of input) {
    grid.push(line.split(''));
  }

  let rollsRemovedThisPass = Infinity;
  while (rollsRemovedThisPass > 0) {
    rollsRemovedThisPass = 0;
    const gridCopy = JSON.parse(JSON.stringify(grid));

    // Check each position in the grid to see if it's a roll and is accessible
    for (let row = 0; row <= grid.length - 1; row++) {
      for (let col = 0; col <= grid[row].length - 1; col++) {
        const currentPos = grid[row][col];

        // Current position is not a roll, skip it
        if (currentPos !== '@') {
          continue;
        } else {
          const rollsAdjacent = countRollsInAdjacentSqaures(grid, row, col);

          // A roll is accessible if it has less than 4 adjacent rolls
          if (rollsAdjacent < 4) {
            logger.logGreen(`!! Roll at (${row}, ${col}) has been removed`);
            rollsRemovedThisPass++;
            gridCopy[row][col] = 'x';
          } else {
            logger.logRed(`XX Roll at (${row}, ${col}) is NOT accessible with ${rollsAdjacent} adjacent rolls`);
          }
        }
      }
    }

    removedRolls += rollsRemovedThisPass;
    grid = JSON.parse(JSON.stringify(gridCopy));
    logger.logGreen(`-- Rolls removed this pass: ${rollsRemovedThisPass}`);
  }

  return removedRolls;
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 1384 : 8013);

export { solve, expected };
