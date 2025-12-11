const partOne = (input: string[]) => {
  const initialProblemGrid = [];

  for (const line of input) {
    initialProblemGrid.push(line.split(' ').filter(x => x !== ''));
  }

  let grandTotal = 0;
  const worksheetLength = initialProblemGrid[0].length;

  for (let problemIndex = 0; problemIndex < worksheetLength; problemIndex++) {
    const problemPieces = initialProblemGrid.map(row => row[problemIndex]);
    const problemOperator = problemPieces.slice(-1)[0];
    const problemNumbers = problemPieces.slice(0, -1).map(num => parseInt(num, 10));

    const problemTotal = problemNumbers.reduce(
      (acc, curr) => {
        switch (problemOperator) {
          case '+':
            return acc + curr;
          case '*':
            return acc * curr;
          default:
            return acc;
        }
      },
      problemOperator === '+' ? 0 : 1,
    );

    grandTotal += problemTotal;
  }

  return grandTotal;
};

const rearrangeNumbersByColumn = (problemNumbers: string[]): number[] => {
  const rearrangedNumbers: number[] = [];
  const maxLength = Math.max(...problemNumbers.map(num => num.length));

  const paddedNumbers = problemNumbers.map(num => num.padStart(maxLength, 'x'));

  let num = '';
  for (let posFromEnd = 1; posFromEnd <= maxLength; posFromEnd++) {
    for (let i = 0; i < problemNumbers.length; i++) {
      // Take digit from each number, starting from the end
      const char = paddedNumbers[i].at(-posFromEnd);
      if (char === 'x') {
        continue;
      }
      num += char;
    }

    rearrangedNumbers.push(parseInt(num, 10));
    num = '';
  }

  return rearrangedNumbers;
};

const getAllIndexesOf = (char: string, str: string): number[] => {
  const indexes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    if (str[i] === char) {
      indexes.push(i);
    }
  }
  return indexes;
};

const partTwo = (input: string[]) => {
  const initialProblemGrid = [];

  const indexesGrid: number[][] = [];
  for (const line of input) {
    const spaceIndexes = getAllIndexesOf(' ', line);
    indexesGrid.push(spaceIndexes);
  }

  const separatorIndexes: number[] = [];
  for (let i = 0; i < indexesGrid.length; i++) {
    for (let j = 1; j < indexesGrid[i].length; j++) {
      if (separatorIndexes.includes(indexesGrid[i][j])) {
        continue;
      }

      const isSeparator = indexesGrid.every(row => row.includes(indexesGrid[i][j]));
      if (isSeparator) {
        separatorIndexes.push(indexesGrid[i][j]);
      }
    }
  }
  separatorIndexes.sort((a, b) => a - b);

  for (const line of input) {
    let strippedLine = line;
    for (const separatorIndex of separatorIndexes) {
      strippedLine = strippedLine.slice(0, separatorIndex) + '.' + strippedLine.slice(separatorIndex + 1);
    }

    initialProblemGrid.push(strippedLine.replaceAll(' ', 'x').split('.'));
  }

  let grandTotal = 0;
  const worksheetLength = initialProblemGrid[0].length;

  for (let problemIndex = 0; problemIndex < worksheetLength; problemIndex++) {
    const problemPieces = initialProblemGrid.map(row => row[problemIndex]);
    const problemOperator = problemPieces.slice(-1)[0].replaceAll('x', '');
    const problemNumbers = rearrangeNumbersByColumn(problemPieces.slice(0, -1));

    const problemTotal = problemNumbers.reduce(
      (acc, curr) => {
        switch (problemOperator) {
          case '+':
            return acc + curr;
          case '*':
            return acc * curr;
          default:
            return acc;
        }
      },
      problemOperator === '+' ? 0 : 1,
    );

    grandTotal += problemTotal;
  }

  return grandTotal;
};

const solve = (input: string[], part: number) => (part === 1 ? partOne(input) : partTwo(input));

const expected = (part: number) => (part === 1 ? 5381996914800 : 9627174150897);

export { solve, expected };
