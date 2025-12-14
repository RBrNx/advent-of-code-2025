const partOne = (input: string[]) => {
  const grid = input.map(line => line.split(''));

  let currentRow = 0;
  let numberOfSplits = 0;

  while (currentRow < grid.length - 1) {
    if (currentRow === 0) {
      const startColumn = grid[currentRow].indexOf('S');
      grid[currentRow + 1][startColumn] = '|';
      currentRow++;
    } else {
      for (let currentColumn = 0; currentColumn < grid[currentRow].length - 1; currentColumn++) {
        const currRowCell = grid[currentRow][currentColumn];
        const nextRowCell = grid[currentRow + 1][currentColumn];

        if (currRowCell === '.') {
          continue;
        } else if (currRowCell === '|') {
          if (nextRowCell === '^') {
            grid[currentRow + 1][currentColumn - 1] = '|';
            grid[currentRow + 1][currentColumn + 1] = '|';
            numberOfSplits++;
          } else {
            grid[currentRow + 1][currentColumn] = '|';
          }
        }
      }

      currentRow++;
    }
  }

  return numberOfSplits;
};

const partTwo = (input: string[]) => {};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 0 : 0);

export { solve, expected };
