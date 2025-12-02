const updatePosition = (currentPos: number, amount: number, direction: string) => {
  let newPos = currentPos;
  let intermediateZeroCount = 0;

  for (let i = 0; i < amount; i++) {
    if (direction === 'L') {
      newPos -= 1;

      if (newPos < 0) {
        newPos = 99;
      }
    } else if (direction === 'R') {
      newPos += 1;

      if (newPos > 99) newPos = 0;
    }

    if (newPos === 0) {
      intermediateZeroCount++;
    }
  }

  return { newPos, intermediateZeroCount };
};

const partOne = (input: string[], enableLogs?: boolean) => {
  let currentDialPos = 50;
  let zeroCount = 0;

  for (const [index, turn] of input.entries()) {
    const [_, direction, amount] = turn.match(/(L|R)(\d+)/) || [];

    const turnAmount = parseInt(amount);
    if (!direction || !Number.isInteger(turnAmount)) {
      continue;
    }

    const { newPos } = updatePosition(currentDialPos, turnAmount, direction);
    currentDialPos = newPos;

    if (enableLogs) {
      console.log(
        `${index}: Turned dial by ${direction === 'L' ? '-' : '+'}${turnAmount}; now at position ${currentDialPos}`,
      );
    }

    if (currentDialPos === 0) {
      zeroCount++;
    }
  }

  return zeroCount;
};

const partTwo = (input: string[], enableLogs?: boolean) => {
  let currentDialPos = 50;
  let zeroCount = 0;

  for (const [index, turn] of input.entries()) {
    const [_, direction, amount] = turn.match(/(L|R)(\d+)/) || [];

    const turnAmount = parseInt(amount);
    if (!direction || !Number.isInteger(turnAmount)) {
      continue;
    }

    const { newPos, intermediateZeroCount } = updatePosition(currentDialPos, turnAmount, direction);
    currentDialPos = newPos;

    if (enableLogs) {
      console.log(
        `${index}: Turned dial by ${direction === 'L' ? '-' : '+'}${turnAmount}; now at position ${currentDialPos}`,
      );
    }

    zeroCount += intermediateZeroCount;
  }

  return zeroCount;
};

const solve = (input: string[], part: number, enableLogs?: boolean) =>
  part === 1 ? partOne(input, enableLogs) : partTwo(input, enableLogs);

const expected = (part: number) => (part === 1 ? 1147 : 6789);

export { solve, expected };
